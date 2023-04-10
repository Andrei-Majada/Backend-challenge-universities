import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { UsersService } from '../src/users/users.service';
import { UsersController } from '../src/users/users.controller';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  const mockUser = {
    _id: '6431df095f487ccadbecfcb1',
    name: 'Fulano',
    email: 'andrei@email.com',
    password: 'teste',
  };

  const mockUsersService = {
    create: jest.fn().mockImplementation((dto) => {
      return {
        id: mockUser._id,
        name: dto.name,
        email: dto.email,
      };
    }),
    signIn: jest.fn().mockImplementation(() => {
      return { access_token: 'token' };
    }),
    recoveryPassword: jest.fn().mockImplementation(() => {
      return { recoveryUrl: `token` };
    }),
    changePassword: jest.fn().mockImplementation(() => {
      return 'Successfully changed password!';
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  it('/users (POST)', () => {
    const dto = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    };
    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(201)
      .then((response) => {
        expect(response.body).toEqual({
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
        });
      });
  });

  it('/users (POST) should return validation error', () => {
    const dto = {
      email: mockUser.email,
      password: mockUser.password,
    };
    return request(app.getHttpServer())
      .post('/users')
      .send(dto)
      .expect(400)
      .then((response) => {
        expect(response.badRequest).toBe(true);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: ['name should not be empty'],
          statusCode: 400,
        });
      });
  });

  it('/users/auth (POST)', () => {
    const dto = {
      email: mockUser.email,
      password: mockUser.password,
    };
    return request(app.getHttpServer())
      .post('/users/auth')
      .send(dto)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ access_token: 'token' });
      });
  });

  it('/users/auth (POST) should return validation error', () => {
    const dto = {
      email: mockUser.email,
    };
    return request(app.getHttpServer())
      .post('/users/auth')
      .send(dto)
      .expect(400)
      .then((response) => {
        expect(response.badRequest).toBe(true);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: ['password should not be empty'],
          statusCode: 400,
        });
      });
  });

  it('/users/recovery (POST)', () => {
    const dto = {
      email: mockUser.email,
    };
    return request(app.getHttpServer())
      .post('/users/recovery')
      .send(dto)
      .expect(200)
      .then((response) => {
        expect(response.body).toEqual({ recoveryUrl: `token` });
        expect(mockUsersService.recoveryPassword).toHaveBeenCalledWith(dto);
      });
  });

  it('/users/recovery (POST) should return validation error', () => {
    const dto = {
      email: 'email@.com',
    };
    return request(app.getHttpServer())
      .post('/users/recovery')
      .send(dto)
      .expect(400)
      .then((response) => {
        expect(response.badRequest).toBe(true);
        expect(response.body).toEqual({
          error: 'Bad Request',
          message: ['email must be an email'],
          statusCode: 400,
        });
      });
  });
});
