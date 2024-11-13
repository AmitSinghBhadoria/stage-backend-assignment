// content.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class AddContentDto {

  @ApiProperty({ description: 'ID of the content to add', example: '67341c8fd13419851004efe3' })
  @IsNotEmpty()
  @IsString()
  contentId: string;

  @ApiProperty({ 
    description: 'Type of content', 
    enum: ['Movie', 'TVShow'], 
    example: 'Movie' 
  })
  @IsNotEmpty()
  @IsEnum(['Movie', 'TVShow'])
  contentType: string;
}
