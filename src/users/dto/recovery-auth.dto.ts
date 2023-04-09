import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RecoveryAuthDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
