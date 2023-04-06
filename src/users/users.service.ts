import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { IAuth } from './interfaces/user.interfaces';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';

const salt = 10;

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { email } = createUserDto;

      const findUser = await this.userModel.findOne({ email }).exec();

      if (findUser) {
        throw new HttpException(
          `Email already exists in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, salt);
      createUserDto.password = hashPassword;

      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new HttpException(
        `Error while creating user. Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(email: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ email }).exec();

      if (!user) {
        throw new HttpException(
          `User not found with email: ${email}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return user;
    } catch (error) {
      throw new HttpException(
        `Error while searching for user with email ${email}. Error: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<IAuth> {
    const { email, pass } = createAuthDto;
    const user = await this.userModel.findOne({ email }).exec();

    const isEqual = await bcrypt.compare(pass, user.password);
    if (!isEqual) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, username: user.name };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async changePassword(updateAuthDto: UpdateAuthDto): Promise<void> {
    try {
      const { email, newPassword } = updateAuthDto;
      const findUser = await this.userModel.findOne({ email }).exec();

      if (!findUser) {
        throw new HttpException(
          `User not found with email: ${email}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const hashPassword = await bcrypt.hash(newPassword, salt);
      findUser.password = hashPassword;

      const user = new this.userModel(findUser);
      await user.save();
    } catch (error) {
      throw new HttpException(
        `Error while searching for user with name ${name}. Error: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
