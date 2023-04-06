import { Controller, Get, HttpCode } from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { University } from './university.schema';

@Controller('/universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  @HttpCode(200)
  findAll(): Promise<University[]> {
    return this.universitiesService.findAll();
  }
}
