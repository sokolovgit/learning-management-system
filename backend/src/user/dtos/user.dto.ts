import { Exclude } from 'class-transformer';
import { UserRole } from '../enums/user-roles.enum';
import { IsString, IsNotEmpty, IsEmail, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @IsNotEmpty()
  @IsNumber()
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
    name: 'password',
    description: 'The password of the user',
    type: 'string',
    example: 'johns_password',
  })
  email: string;

  @IsNotEmpty()
  @ApiProperty({
    name: 'role',
    description: 'The role of the user',
    type: 'UserRole',
    example: UserRole.STUDENT,
  })
  role: UserRole;

  @Exclude()
  password: string;

  constructor(partial: Partial<UserDto>) {
    Object.assign(this, partial);
  }
}
