import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class UpdateUniversityDto {
  @ApiProperty()
  @IsArray()
  web_pages: string[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  @IsArray()
  domains: string[];
}
