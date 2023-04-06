import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UniversitiesModule } from './universities/universities.module';
import { UsersModule } from './users/users.module';

const MONGO_URL = 'mongodb://localhost:27017/university';

@Module({
  imports: [
    MongooseModule.forRoot(MONGO_URL),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UniversitiesModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
