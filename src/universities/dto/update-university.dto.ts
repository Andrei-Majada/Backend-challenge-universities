import { ApiProperty } from '@nestjs/swagger';

export class UpdateUniversityDto {
  @ApiProperty()
  web_pages: string[];

  @ApiProperty()
  name: string;

  @ApiProperty()
  domains: string[];
}
