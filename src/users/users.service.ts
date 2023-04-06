import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const { name, email } = createUserDto;

      const findUser = await this.userModel.findOne({ name, email }).exec();

      if (findUser) {
        throw new HttpException(
          `User already exists in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const user = new this.userModel(createUserDto);
      return await user.save();
    } catch (error) {
      throw new HttpException(
        `Error while creating user. Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(name: string, password: string): Promise<User> {
    try {
      const user = await this.userModel.findOne({ name }).exec();

      if (!user) {
        throw new HttpException(
          `User not found with name: ${name}.`,
          HttpStatus.NOT_FOUND,
        );
      } else if (password !== user.password) {
        throw new UnauthorizedException();
      }

      return user;
    } catch (error) {
      throw new HttpException(
        `Error while searching for user with name ${name}. Error: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
