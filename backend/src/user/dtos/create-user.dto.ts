import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail } from 'class-validator';

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
}
