import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNotEmpty } from 'class-validator';

export class CreateUniversityDto {
  @ApiProperty()
  'state-province': string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  web_pages: string[];

  @ApiProperty()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  alpha_two_code: string;

  @ApiProperty()
  @IsArray()
  @IsNotEmpty()
  domains: string[];
}
