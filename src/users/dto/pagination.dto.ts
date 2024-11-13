// pagination.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsInt, Min, Max, IsNumber } from 'class-validator';

export class PaginationDto {
  @ApiPropertyOptional({
    description: 'The maximum number of records to fetch per page',
    example: 10,
    required: false,
    default: 10,
    minimum: 1,
    maximum: 100,
    type: Number,
  })
  @IsOptional()
  limit: number

  @ApiPropertyOptional({
    description: 'The number of records to skip (pagination offset)',
    example: 0,
    required: false,
    type: Number,
  })
  @IsOptional()
  offset: number
}
