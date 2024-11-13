import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../models/user.schema'; // Import User schema
import { TVShow, TVShowDocument } from '../models/tvshow.schema'; // Import TVShow schema if you want to fetch full details
import { DBError, DBSuccess } from 'src/shared/dtos/response.dto';
import { Movie, MovieDocument } from 'src/models/movie.schema';
import * as mongoose from 'mongoose';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    @InjectModel(TVShow.name)
    private readonly tvShowModel: Model<TVShowDocument>,
    @InjectModel(Movie.name)
    private readonly movieModel: Model<MovieDocument>,
  ) {}

  // Get user's Content list with pagination
  async getUserContentList(
    userId: string,
    limit: number = 10,
    offset: number = 0,
  ) {
    try {
      this.logger.log(typeof limit,typeof offset)
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new DBError('ADD_TO_USER_CONTENT_LIST.USER_SERVICE.ERROR', {
          message: 'User not found',
        });
      }
      // Extract the contentId values from the user's myList
      const contentIds = user.myList.map((item) => new mongoose.Types.ObjectId(item.contentId));
      this.logger.log('Content IDs:', contentIds);

      const combinedContent = await this.tvShowModel.aggregate([
        {
          $match: { _id: { $in: contentIds } } // Match TV shows based on contentIds
        },
        {
          $unionWith: {
            coll: 'movies', // Specify the 'movies' collection to merge with
            pipeline: [
              {
                $match: { _id: { $in: contentIds } } // Match Movies based on contentIds
              }
            ]
          }
        },
        {
          $skip: offset // Apply pagination offset
        },
        {
          $limit: limit // Apply pagination limit
        }
      ]);
      this.logger.log('Combined Content:', combinedContent);
      if (combinedContent) {
        return new DBSuccess('GET_USER_CONTENT_LIST.SUCCESS', combinedContent);
      }
    } catch (error) {
      return new DBError('GET_USER_CONTENT_LIST.USER_SERVICE.ERROR', error);
    }
  }

  // Add a TV show or movie to the user's list (check for duplicates)
  async addToUserContentList(
    userId: string,
    contentId: string,
    contentType: string,
  ) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new DBError('ADD_TO_USER_CONTENT_LIST.USER_SERVICE.ERROR', {
          message: 'User not found',
        });
      }

      // Ensure that the item is not already in the list
      const existingItem = user.myList.find(
        (item) =>
          item.contentId === contentId && item.contentType === contentType,
      );
      if (existingItem) {
        return new DBError('ADD_TO_USER_CONTENT_LIST.USER_SERVICE.ERROR', {
          message: 'Content Already Exists in User List',
        });
      }

      // Add the new content to the list
      user.myList.push({ contentId, contentType });
      const contentAdded = await user.save();
      if (contentAdded) {
        return new DBSuccess('ADD_TO_USER_CONTENT_LIST.SUCCESS', contentAdded);
      }
    } catch (error) {
      return new DBError('ADD_TO_USER_CONTENT_LIST.USER_SERVICE.ERROR', error);
    }
  }

  // Remove a TV show or movie from the user's list
  async removeContentFromUserList(userId: string, contentId: string) {
    try {
      const user = await this.userModel.findById(userId);
      if (!user) {
        return new DBError('REMOVE_CONTENT_FORM_USER_LIST.USER_SERVICE.ERROR', {
          message: 'User not found',
        });
      }

      // Find and remove the item from the user's list by contentId
      const index = user.myList.findIndex(
        (item) => item.contentId === contentId,
      );
      if (index === -1) {
        return new DBError('REMOVE_CONTENT_FORM_USER_LIST.USER_SERVICE.ERROR', {
          message: 'TV show or movie not found in your list',
        });
      }

      // Remove the item from the list
      user.myList.splice(index, 1);
      const contentRemoved = await user.save();
      if (contentRemoved) {
        return new DBSuccess(
          'REMOVE_CONTENT_FORM_USER_LIST.SUCCESS',
          contentRemoved,
        );
      }
    } catch (error) {
      return new DBError(
        'REMOVE_CONTENT_FORM_USER_LIST.USER_SERVICE.ERROR',
        error,
      );
    }
  }
}
