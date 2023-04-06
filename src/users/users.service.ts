import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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
}
