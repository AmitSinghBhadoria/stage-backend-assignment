import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  BadRequestException,
  HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service'; // Import UserService
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { PaginationDto } from './dto/pagination.dto';
import { CreateTVshowDto } from 'src/tvshows/dto/create-tvshow.dto';
import { ContentResponseDto } from './dto/content-response.dto';
import { ResponseError, ResponseSuccess } from 'src/shared/dtos/response.dto';
import { AddContentDto } from './dto/add-content.dto';
import { RemoveContentDto } from './dto/remove-content.dto';

@ApiTags('User Content List')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':userId/list')
  @ApiOperation({ summary: 'Get user content list with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetched content list',
    type: [ContentResponseDto],
  })
  async getUserContentList(
    @Param('userId') userId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const offset = Number(paginationDto.offset) || 0; // Convert to number
    const limit = Number(paginationDto.limit) || 10; // Convert to number
  
    // const { limit, offset } = paginationDto;

    const userContentList = await this.usersService.getUserContentList(
      userId,
      limit,
      offset,
    );

    return userContentList.success
      ? new ResponseSuccess(
          'GET_USER_CONTENT_LIST.SUCCESS',
          HttpStatus.OK,
          userContentList.data,
        )
      : new ResponseError(
          'GET_USER_CONTENT_LIST.FAILURE',
          HttpStatus.INTERNAL_SERVER_ERROR,
          userContentList.errors,
        );
  }

  @Post(':userId/list')
  @ApiOperation({ summary: 'Add Content to user list' })
  @ApiResponse({
    status: 201,
    description: 'Content added to user list',
    type: ContentResponseDto,
  })
  async addToUserContentList(
    @Param('userId') userId: string,
    @Query() addContentDto: AddContentDto,
  ) {
    const {  contentId, contentType } = addContentDto;

    const addedContent = await this.usersService.addToUserContentList(
      userId,
      contentId,
      contentType,
    );

    return addedContent.success
      ? new ResponseSuccess(
          'ADD_TO_USER_CONTENT_LIST.SUCCESS',
          HttpStatus.CREATED,
          addedContent.data,
        )
      : new ResponseError(
          'ADD_TO_USER_CONTENT_LIST.FAILURE',
          HttpStatus.INTERNAL_SERVER_ERROR,
          addedContent.errors,
        );
  }

  // DELETE /users/:userId/list/:contentId
  @Delete(':userId/list/:contentId')
  @ApiOperation({ summary: 'Remove Content from user list' })
  @ApiResponse({
    status: 200,
    description: 'Successfully removed content from list',
  })
  async removeFromUserContentList(@Param() params: RemoveContentDto) {
    const { userId, contentId } = params;

    const removeContent = await this.usersService.removeContentFromUserList(
      userId,
      contentId,
    );

    return removeContent.success
      ? new ResponseSuccess(
          'REMOVE_FROM_USER_CONTENT_LIST.SUCCESS',
          HttpStatus.OK,
          removeContent.data,
        )
      : new ResponseError(
          'REMOVE_FROM_USER_CONTENT_LIST.FAILURE',
          HttpStatus.INTERNAL_SERVER_ERROR,
          removeContent.errors,
        );
  }
}
