import { ApiProperty } from '@nestjs/swagger';

export class CreateUniversityDto {
  @ApiProperty()
  state_province: string;

  @ApiProperty()
  web_pages: [string];

  @ApiProperty()
  country: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  alpha_two_code: string;

  @ApiProperty()
  domains: [string];
}
