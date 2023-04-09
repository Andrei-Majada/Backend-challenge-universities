import { Logger, Module } from '@nestjs/common';
import { CronjobsService } from './cronjobs.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UniversitiesModule } from 'src/universities/universities.module';
import {
  University,
  UniversitySchema,
} from 'src/universities/university.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: University.name, schema: UniversitySchema },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UniversitiesModule,
  ],
  providers: [CronjobsService],
})
export class CronjobsModule {}
