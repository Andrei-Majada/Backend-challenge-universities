import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import {
  IAuth,
  ICreateUser,
  IRecoveryPass,
} from './interfaces/user.interfaces';
import { RecoveryAuthDto } from './dto/recovery-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('/auth')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() createAuthDto: CreateAuthDto): Promise<IAuth> {
    return this.usersService.signIn(createAuthDto);
  }

  @Post('/recovery')
  @HttpCode(HttpStatus.OK)
  recoveryPassword(
    @Body() recoveryAuthDto: RecoveryAuthDto,
  ): Promise<IRecoveryPass> {
    return this.usersService.recoveryPassword(recoveryAuthDto);
  }

  @Post('/recovery/:recoveryToken')
  @HttpCode(HttpStatus.OK)
  changePassword(
    @Param('recoveryToken') recoveryToken: string,
    @Body() changePasswordDto: ChangePasswordDto,
  ): Promise<string> {
    return this.usersService.changePassword(recoveryToken, changePasswordDto);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): Promise<ICreateUser> {
    return this.usersService.create(createUserDto);
  }
}
