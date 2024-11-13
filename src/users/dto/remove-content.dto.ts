// remove-content.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class RemoveContentDto {
  @ApiProperty({ description: 'ID of the user', example: '12345' })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({ description: 'ID of the content to remove', example: '67890' })
  @IsNotEmpty()
  @IsString()
  contentId: string;
}
