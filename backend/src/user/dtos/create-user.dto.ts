import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    name: 'username',
    description: 'The name of the user',
    required: true,
    type: 'string',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    name: 'password',
    description: 'The password of the user',
    required: true,
    type: 'string',
    example: 'johns_password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    required: true,
    type: 'string',
    example: 'john.doe@email.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    name: 'role',
    description: 'The role of the user',
    required: true,
    type: 'string',
    example: 'admin',
  })
  @IsNotEmpty()
  @IsString()
  role: UserRole;
}
