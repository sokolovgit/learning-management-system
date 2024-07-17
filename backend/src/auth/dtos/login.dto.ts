import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'my.email@test.com',
  })
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'my_password',
  })
  password: string;
}
