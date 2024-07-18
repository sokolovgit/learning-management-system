import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import { PaginatedResponse } from '../common/responses/paginated.response';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createUserWithHashedPassword(
    createUserDto: CreateUserDto,
  ): Promise<User> {
    createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAllPaginated(
    page?: number,
    pageSize?: number,
  ): Promise<PaginatedResponse<User>> {
    const actualPage = page || 1;
    const actualPageSize: number = pageSize || 10;

    const users: User[] = await this.userRepository.find({
      skip: (actualPage - 1) * actualPageSize,
      take: actualPageSize,
    });

    const total: number = await this.userRepository.count();
    const totalPages: number = Math.ceil(total / actualPageSize);

    const paginatedResponse: PaginatedResponse<User> =
      new PaginatedResponse<User>(users, total, actualPage, totalPages);

    paginatedResponse.setNavigationPages();

    return paginatedResponse;
  }

  async findOneOrThrow(id: number): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      id: id,
    });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return user;
  }

  async findOneByEmailOrThrow(email: string): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      email: email,
    });

    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }

    return user;
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}