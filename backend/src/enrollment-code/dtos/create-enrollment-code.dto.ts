import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsInt, Min } from 'class-validator';

export class CreateEnrollmentCodeDto {
  @ApiProperty({
    description: 'The date when the enrollment code will expire',
    required: false,
    type: String,
    example: '2025-07-01T00:00:00.000Z', // ISO 8601 format
  })
  @IsOptional()
  @IsDateString()
  expiration: string;

  @ApiProperty({
    description: 'Maximum number of uses for the enrollment code',
    required: false,
    type: Number,
    example: 5,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  maxUses: number;
}
