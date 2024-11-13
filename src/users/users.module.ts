// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../models/user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TVShow, TVShowSchema } from 'src/models/tvshow.schema';
import { Movie, MovieSchema } from 'src/models/movie.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema },{ name: TVShow.name, schema: TVShowSchema },{ name: Movie.name, schema: MovieSchema }])],
  exports: [MongooseModule,],  // Expose the Mongoose module for UserModel to other modules
  controllers: [UsersController],
providers: [UsersService],
})
export class UsersModule {}