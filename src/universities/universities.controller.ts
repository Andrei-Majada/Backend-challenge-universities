import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { UniversitiesService } from './universities.service';
import { University } from './university.schema';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { IUniversityPagination } from './interfaces/universities.interfaces';
import { AuthGuard } from 'src/users/auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('/universities')
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<University> {
    return this.universitiesService.create(createUniversityDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string): Promise<University> {
    return this.universitiesService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get(':page/:country')
  @HttpCode(HttpStatus.OK)
  findAll(
    @Param('page') page: number,
    @Param('country') country: string,
  ): Promise<IUniversityPagination> {
    return this.universitiesService.findAll(page, country);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() UupdateUniversityDto: UpdateUniversityDto,
  ): Promise<University | undefined> {
    return this.universitiesService.update(id, UupdateUniversityDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.universitiesService.delete(id);
  }
}
