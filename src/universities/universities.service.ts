import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { University, UniversityDocument } from './university.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUniversityDto } from './dto/create-university.dto';

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
  ) {}

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    try {
      const university = new this.universityModel(createUniversityDto);
      return university.save();
    } catch (error) {
      throw new HttpException(
        `Error while creating university. Error: ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(): Promise<University[]> {
    try {
      const universities = this.universityModel.find().exec();

      if (!universities) {
        throw new HttpException(
          `No universities found in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return universities;
    } catch (error) {
      throw new HttpException(
        `Error while searching for universities. Error: ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
