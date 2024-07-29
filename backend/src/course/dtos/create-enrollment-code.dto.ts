import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateEnrollmentCodeDto {
  @ApiProperty({
    description: 'The date when the enrollment code will expire',
    type: String,
    example: '2021-12-31T23:59:59.999Z',
    required: false,
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiration: Date;

  @ApiProperty({
    description: 'Whether the enrollment code can only be used once',
    type: Boolean,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  oneTimeUse: boolean;
}
