import { IsString, IsNotEmpty, IsEmail } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

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
    example: 'test_password123',
  })
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    name: 'email',
    description: 'The email of the user',
    required: true,
    type: 'string',
    example: 'test.mail@test.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
