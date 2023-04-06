import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { University } from './university.schema';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { UniversityPagination } from './interfaces/universities.interfaces';

@Controller('/universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  @HttpCode(201)
  create(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<University> {
    return this.universitiesService.create(createUniversityDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<University> {
    return this.universitiesService.findOne(id);
  }

  @Get(':page/:country')
  findAll(
    @Param('page') page: number,
    @Param('country') country?: string,
  ): Promise<UniversityPagination> {
    return this.universitiesService.findAll(page, country);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() UupdateUniversityDto: UpdateUniversityDto,
  ): Promise<University | undefined> {
    return this.universitiesService.update(id, UupdateUniversityDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }
}
