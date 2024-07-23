import { UserRole } from '../enums/user-role.enum';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class UserDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    description: 'The ID of the user',
    type: 'number',
    example: 1,
  })
  id: number;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    name: 'username',
    description: 'The name of the user',
    type: 'string',
    example: 'John Doe',
  })
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    type: 'string',
    example: 'john.doe@example.com',
  })
  email: string;

  password: string;

  @IsNotEmpty()
  @ApiProperty({
    name: 'role',
    description: 'The role of the user',
    type: 'UserRole',
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @ApiProperty({
    description: 'The creation date of the user',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'The update date of the user',
    type: 'string',
    example: '2021-07-09T11:38:10.000Z',
  })
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
  }
}
