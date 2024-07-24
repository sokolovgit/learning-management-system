import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

describe('UserService', () => {
  let service: UserService;
  let mockUserRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    mockUserRepository = {
      find: jest.fn().mockResolvedValue([new User(), new User()]),
      findOneOrFail: jest.fn().mockResolvedValue(new User()),
      save: jest
        .fn()
        .mockImplementation((user) =>
          Promise.resolve({ id: Date.now(), ...user }),
        ),
      delete: jest.fn().mockResolvedValue({ affected: 1 }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    await expect(service.findAllPaginated()).resolves.toHaveLength(2);
    expect(mockUserRepository.find).toHaveBeenCalled();
  });

  it('should return a single user by id', async () => {
    const user = new User();
    user.id = 1;
    await expect(service.findOneByIdOrThrow(1)).resolves.toEqual(user);
    expect(mockUserRepository.findOneOrFail).toHaveBeenCalledWith(1);
  });

  it('should create a new user and return it', async () => {
    const userDto = {
      username: 'Test User',
      email: 'test@example.com',
      password: 'UserPassword123',
    };
    await expect(
      service.createUserWithHashedPassword(userDto),
    ).resolves.toHaveProperty('id');
    expect(mockUserRepository.save).toHaveBeenCalledWith(userDto);
  });

  it('should delete a user and return affected result', async () => {
    await expect(service.remove(1)).resolves.toEqual({ affected: 1 });
    expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
  });
});
