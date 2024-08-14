import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipeBuilder,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { PaginatedResponseDto } from '../common/dtos/pagination.dto';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './entities/user.entity';
import { UserDto } from './dtos/user.dto';
import { ApiBody, ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationQueryOptionsDto } from '../common/dtos/pagination-query-options.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '../common/decorators/auth.decorator';
import { Action } from '../abilities/enums/abilities.enum';
import { CurrentUser } from './decorators/user.decorator';

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
    return this.userService.createUserWithHashedPasswordOrThrow(createUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(id);
  }

  @Post('upload')
  @Auth()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'File upload',
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: 'image',
        })
        .addMaxSizeValidator({
          maxSize: 10 * 1024 * 1024, // 10 MB
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    console.log(file);

    const updatedUser = await this.userService.uploadProfilePicture(user, file);
    const userDto = new UserDto(updatedUser);
    return userDto;
  }
}
