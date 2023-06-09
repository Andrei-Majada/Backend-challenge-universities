import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { University, UniversityDocument } from './university.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { IUniversityPagination } from './interfaces/universities.interfaces';
import * as dotenv from 'dotenv';
dotenv.config();

@Injectable()
export class UniversitiesService {
  constructor(
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
  ) {}

  async create(createUniversityDto: CreateUniversityDto): Promise<University> {
    try {
      const { country, name } = createUniversityDto;
      const state_province = createUniversityDto['state-province'];

      const findUniversity = await this.universityModel
        .findOne({ 'state-province': state_province, country, name })
        .exec();

      if (findUniversity) {
        throw new HttpException(
          `University already exists in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const university = new this.universityModel(createUniversityDto);
      return await university.save();
    } catch (error) {
      throw new HttpException(
        `Error while creating university. ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll(page: number, country: string): Promise<IUniversityPagination> {
    try {
      const paginationLimit = parseInt(process.env.PAGINATION_LIMIT);

      const universities = await this.universityModel
        .find(country === 'Any' ? {} : { country })
        .select({ _id: 1, country: 1, name: 1, 'state-province': 1 })
        .limit(paginationLimit * 1)
        .skip((page - 1) * paginationLimit)
        .sort({ country: 1 })
        .exec();

      if (!universities) {
        throw new HttpException(
          `No universities found in database.`,
          HttpStatus.NOT_FOUND,
        );
      }

      const totalCount = await this.universityModel.count(
        country === 'Any' ? {} : { country },
      );

      return {
        universities,
        totalPages: Math.ceil(totalCount / paginationLimit),
        currentPage: Number(page),
      };
    } catch (error) {
      throw new HttpException(
        `Error while searching for universities. ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOne(id: string): Promise<University> {
    try {
      const university = await this.universityModel.findOne({ _id: id }).exec();

      if (!university) {
        throw new HttpException(
          `University not found with id: ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return university;
    } catch (error) {
      throw new HttpException(
        `Error while searching for university with id ${id}. ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async update(
    id: string,
    updateUniversityDto: UpdateUniversityDto,
  ): Promise<University | undefined> {
    try {
      const university = await this.universityModel.findOneAndUpdate(
        { _id: id },
        updateUniversityDto,
        {
          new: true,
        },
      );

      if (!university) {
        throw new HttpException(
          `University not found with id: ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return university;
    } catch (error) {
      throw new HttpException(
        `Error while updating university with id: ${id}. ${error}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async delete(id: string) {
    try {
      const university = await this.universityModel.findOne({ _id: id });

      if (!university) {
        throw new HttpException(
          `University not found with id: ${id}.`,
          HttpStatus.NOT_FOUND,
        );
      }

      return await this.universityModel.deleteOne({ _id: id });
    } catch (error) {
      throw new HttpException(
        `Error while deleting university with id ${id}. ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
