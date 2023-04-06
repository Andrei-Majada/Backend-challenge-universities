import { Controller, Get } from '@nestjs/common';
import { UniversitiesService } from './universities.service';

@Controller('/universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Get()
  getHello(): string {
    return this.universitiesService.getHello();
  }
}
