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
import {
  IAuth,
  ICreateUser,
  IRecoveryPass,
} from './interfaces/user.interfaces';
import { RecoveryAuthDto } from './dto/recovery-auth.dto';
import { CreateAuthDto } from './dto/create-auth.dto';
import * as dotenv from 'dotenv';
import { ChangePasswordDto } from './dto/change-password.dto';
dotenv.config();

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<ICreateUser> {
    try {
      const { email } = createUserDto;

      const findUser = await this.userModel.findOne({ email }).exec();

      if (findUser) {
        throw new HttpException(
          `Email already exists in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const hashPassword = await bcrypt.hash(createUserDto.password, 10);
      createUserDto.password = hashPassword;

      const user = new this.userModel(createUserDto);
      await user.save();
      return {
        id: user._id,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      throw new HttpException(
        `Error while creating user. ${error}`,
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
        `Error while searching for user with email ${email}. ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async signIn(createAuthDto: CreateAuthDto): Promise<IAuth> {
    const { email, password } = createAuthDto;
    const user = await this.userModel.findOne({ email }).exec();

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throw new UnauthorizedException();
    }

    const payload = { id: user.id, username: user.name };
    const token = await this.jwtService.signAsync(payload);
    return { access_token: token };
  }

  async recoveryPassword(
    recoveryAuthDto: RecoveryAuthDto,
  ): Promise<IRecoveryPass> {
    try {
      const { email } = recoveryAuthDto;
      const findUser = await this.userModel.findOne({ email }).exec();

      if (!findUser) {
        throw new HttpException(
          `User not found with email: ${email}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const payload = {
        email: findUser.email,
        createdAt: Date.now(),
      };
      const token = await this.jwtService.signAsync(payload);
      return {
        recoveryUrl: `{{BASEURL}}/users/recovery/${token}`,
      };
    } catch (error) {}
  }

  async changePassword(
    recoveryToken: string,
    changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    try {
      const { newPassword, confirmNewPassword } = changePasswordDto;

      const userInfo = await this.jwtService.verifyAsync(recoveryToken, {
        secret: process.env.SECRET,
      });

      const { email } = userInfo;

      const findUser = await this.userModel.findOne({ email }).exec();

      if (!findUser) {
        throw new HttpException(`User not found.`, HttpStatus.NOT_FOUND);
      }

      const isEqual = await bcrypt.compare(newPassword, findUser.password);
      if (isEqual) {
        throw new HttpException(
          `New password cannot be equal to old password.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (newPassword !== confirmNewPassword) {
        throw new HttpException(
          `Passwors don't match.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashPassword = await bcrypt.hash(newPassword, 10);
      findUser.password = hashPassword;

      const user = new this.userModel(findUser);
      await user.save();
      return 'Successfully changed password!';
    } catch (error) {
      throw new HttpException(
        `Error while searching for user. ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
