import { Injectable } from '@nestjs/common';

@Injectable()
export class UniversitiesService {
  getHello(): string {
    return 'Health Check!';
  }
}
