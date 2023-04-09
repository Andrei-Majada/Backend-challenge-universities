import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { Model } from 'mongoose';
import {
  University,
  UniversityDocument,
} from 'src/universities/university.schema';

@Injectable()
export class CronjobsService {
  private readonly logger = new Logger(CronjobsService.name);
  constructor(
    @InjectModel(University.name)
    private universityModel: Model<UniversityDocument>,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateUniversitiesList() {
    this.logger.log('Atualizando lista de universidades...');

    try {
      const countrysList = [
        'Argentina',
        'Brazil',
        'Chile',
        'Colombia',
        'Paraguay',
        'Peru',
        'Suriname',
        'Uruguay',
      ];
      const reponse = await axios.get(process.env.UNIVERSITIES_URL);
      const universities = reponse.data;

      if (universities) {
        universities.forEach(async (university) => {
          if (countrysList.includes(university.country)) {
            await this.universityModel.findOneAndUpdate(
              { country: university.country, name: university.name },
              university,
              {
                new: true,
              },
            );
          }
        });
      }
      this.logger.log('Lista de universidades atualizada com sucesso!');
    } catch (error) {
      this.logger.log('Lista de universidades não pode ser atualizada!');
      throw new HttpException(
        `Error while updating university list. ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
