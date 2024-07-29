import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dtos/create-user.dto';
import * as bcrypt from 'bcryptjs';
import { UpdateUserDto } from './dtos/update-user.dto';

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

  async findAllPaginated(page: number, pageSize: number) {
    const [users, total] = await this.userRepository.findAndCount({
      relations: {
        teachingCourses: true,
        enrolledCourses: true,
      },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalPages: number = Math.ceil(total / pageSize);

    return {
      users,
      total,
      page,
      totalPages,
    };
  }

  async findOneByIdOrThrow(id: number): Promise<User> {
    const user: User = await this.userRepository.findOne({
      where: { id: id },
      relations: {
        teachingCourses: true,
        enrolledCourses: true,
      },
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

  async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const result = await this.userRepository.update(id, updateUserDto);

    if (result.affected === 0) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return this.findOneByIdOrThrow(id);
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }
}
