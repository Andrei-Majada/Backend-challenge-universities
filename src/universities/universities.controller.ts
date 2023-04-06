import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { University } from './university.schema';
import { CreateUniversityDto } from './dto/create-university.dto';

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

  @Get()
  @HttpCode(200)
  findAll(): Promise<University[]> {
    return this.universitiesService.findAll();
  }
}
