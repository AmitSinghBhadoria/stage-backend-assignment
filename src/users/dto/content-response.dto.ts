import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CreateMovieDto } from 'src/movies/dto/create-movie.dto';
import { CreateTVshowDto } from 'src/tvshows/dto/create-tvshow.dto';

export class ContentResponseDto {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(CreateTVshowDto) },
      { $ref: getSchemaPath(CreateMovieDto) },
    ],
  })
  content: CreateTVshowDto | CreateMovieDto;
}
