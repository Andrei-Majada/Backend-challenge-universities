import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;

  const mockUser = {
    _id: '6431df095f487ccadbecfcb1',
    name: 'Fulano',
    email: 'fulano@email.com',
    password: 'teste',
  };

  const mockUsersService = {
    create: jest.fn((dto) => {
      return {
        id: mockUser._id,
        name: dto.name,
        email: dto.email,
      };
    }),
    signIn: jest.fn(() => {
      return { access_token: 'token' };
    }),
    recoveryPassword: jest.fn(() => {
      return { recoveryUrl: `token` };
    }),
    changePassword: jest.fn(() => {
      return 'Successfully changed password!';
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController],
    })
      .overrideProvider(UsersService)
      .useValue(mockUsersService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return user info after creating', () => {
    const dto = {
      name: mockUser.name,
      email: mockUser.email,
      password: mockUser.password,
    };
    expect(controller.create(dto)).toEqual({
      id: mockUser._id,
      name: mockUser.name,
      email: mockUser.email,
    });
    expect(mockUsersService.create).toHaveBeenCalledWith(dto);
  });

  it('should auth user and return token', () => {
    const dto = {
      email: mockUser.email,
      password: mockUser.password,
    };
    expect(controller.signIn(dto)).toEqual({ access_token: 'token' });
    expect(mockUsersService.signIn).toHaveBeenCalledWith(dto);
  });

  it('should recovery user password', () => {
    const dto = {
      email: mockUser.email,
    };
    expect(controller.recoveryPassword(dto)).toEqual({ recoveryUrl: `token` });
    expect(mockUsersService.recoveryPassword).toHaveBeenCalledWith(dto);
  });

  it('should update user password', () => {
    const recoveryToken = 'token';
    const dto = {
      newPassword: 'pass',
      confirmNewPassword: 'pass',
    };
    expect(controller.changePassword(recoveryToken, dto)).toEqual(
      'Successfully changed password!',
    );
    expect(mockUsersService.changePassword).toHaveBeenCalledWith(
      recoveryToken,
      dto,
    );
  });
});
