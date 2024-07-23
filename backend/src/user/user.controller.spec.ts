import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';

describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: {
            findAll: jest.fn().mockResolvedValue([new User(), new User()]),
            findOne: jest
              .fn()
              .mockImplementation(() => Promise.resolve(new User())),
            create: jest
              .fn()
              .mockImplementation((userDto: CreateUserDto) =>
                Promise.resolve({ id: 1, ...userDto }),
              ),
            remove: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should return an array of users', async () => {
    await expect(controller.findAll()).resolves.toHaveLength(2);
    expect(service.findAllPaginated).toHaveBeenCalled();
  });

  it('should return a single user by id', async () => {
    await expect(controller.findOne(1)).resolves.toBeInstanceOf(User);
    expect(service.findOneByIdOrThrow).toHaveBeenCalledWith(1);
  });

  it('should create a new user and return that', async () => {
    const createUserDto: CreateUserDto = {
      username: 'Test User',
      email: 'test@example.com',
      password: 'UserPassword123',
    };
    await expect(controller.create(createUserDto)).resolves.toEqual({
      id: 1,
      ...createUserDto,
    });
    expect(service.createUserWithHashedPassword).toHaveBeenCalledWith(
      createUserDto,
    );
  });

  it('should delete a user and return void', async () => {
    await expect(controller.remove(1)).resolves.toBeUndefined();
    expect(service.remove).toHaveBeenCalledWith(1);
  });

  it('should throw NotFoundException when trying to find a non-existing user', async () => {
    jest
      .spyOn(service, 'findOneByIdOrThrow')
      .mockRejectedValueOnce(new NotFoundException());
    await expect(controller.findOne(999)).rejects.toThrow(NotFoundException);
  });
});
