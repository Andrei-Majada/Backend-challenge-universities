import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IAuth } from './interfaces/user.interfaces';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() createAuthDto: CreateAuthDto): Promise<IAuth> {
    return this.usersService.signIn(createAuthDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
