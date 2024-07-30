import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationQueryOptionsDto } from '../common/dtos/pagination-query-options.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Number of items per page',
  })
  @ApiResponse({ status: 200, type: PaginatedResponseDto<UserDto[]> })
  async findAll(@Query() paginationOptions: PaginationQueryOptionsDto) {
    const { users, total, page, totalPages } =
      await this.userService.findAllPaginated(
        paginationOptions.page,
        paginationOptions.pageSize,
      );

    const userDtos = users.map((user) => new UserDto(user));
    return new PaginatedResponseDto<UserDto>(userDtos, total, page, totalPages);
  }

  @ApiResponse({ status: 200, type: UserDto })
  @Get(':id')
  async findOne(@Param('id') id: number): Promise<UserDto> {
    const user: User = await this.userService.findOneByIdOrThrow(id);

    return new UserDto(user);
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.userService.createUserWithHashedPassword(createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }
}
