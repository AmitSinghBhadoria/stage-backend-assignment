import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesModule } from './movies/movies.module';
import { TvshowsModule } from './tvshows/tvshows.module';
import { SeedService } from './seed/seed.service';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://mongodb:27017/stagedb'),
    MoviesModule,
    TvshowsModule,
    UsersModule
  ],
  providers: [SeedService],
})
export class AppModule {}
