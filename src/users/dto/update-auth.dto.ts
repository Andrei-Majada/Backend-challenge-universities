import { ApiProperty } from '@nestjs/swagger';

export class UpdateAuthDto {
  @ApiProperty()
  email: string;

  @ApiProperty()
  newPassword: string;
}
