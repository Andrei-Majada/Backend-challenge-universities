import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { User } from './user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { IAuth } from './interfaces/user.interfaces';
import { UpdateAuthDto } from './dto/update-auth.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() createAuthDto: CreateAuthDto): Promise<IAuth> {
    return this.usersService.signIn(createAuthDto);
  }

  @Post('/change/auth')
  @HttpCode(HttpStatus.OK)
  changePassword(@Body() updateAuthDto: UpdateAuthDto): Promise<void> {
    return this.usersService.changePassword(updateAuthDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}
