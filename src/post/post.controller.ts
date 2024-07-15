import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiExtraModels, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { IGetPostListRequest, IModifyPostRequest, IPostInfo } from 'src/common/interface/post.dto';
import { ApiResponseWithType, BooleanProperty, ObjectProperty } from 'src/common/swagger/custom-response';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';
import { AuthRequest } from 'src/common/interface/auth.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostService } from './post.service';
import { IResponse } from 'src/common/interface/response.dto';
import { IAddCommentRequest, IComment } from 'src/common/interface/comment.dto';
import { Public } from 'src/auth/auth.decorator';

@ApiTags('Post')
@Controller('post')
export class PostController {
  constructor(
    private postService: PostService
  ) { }

  @UseGuards(AuthGuard)
  @Post('postList')
  @Public()
  @UseInterceptors(CacheInterceptor)
  @CacheTTL(60)
  @HttpCode(HttpStatus.OK)
  @ApiExtraModels(IResponse, IPostInfo)
  @ApiResponse(ApiResponseWithType(ObjectProperty(getSchemaPath(IPostInfo))))
  getPost(
    @Request() authHeader: AuthRequest,
    @Body() request: IGetPostListRequest
  ): IPostInfo[] {
    const userId = authHeader.user?.userId ?? null;
    return this.postService.getPost(request, userId);
  }

  @Get(':postId')
  @ApiExtraModels(IResponse, IPostInfo, IComment)
  @ApiResponse(ApiResponseWithType(ObjectProperty(getSchemaPath(IPostInfo))))
  getPostById(@Param('postId') postId: string): IPostInfo {
    return this.postService.getPostById(postId);
  }

  @UseGuards(AuthGuard)
  @Post()
  @ApiBearerAuth()
  @ApiResponse(ApiResponseWithType(BooleanProperty))
  addPost(
    @Request() authHeader: AuthRequest,
    @Body() request: IModifyPostRequest
  ) {
    const userId = authHeader.user?.userId ?? null;
    return this.postService.addPost(userId, request);
  }

  @UseGuards(AuthGuard)
  @Put(':postId')
  @ApiBearerAuth()
  @ApiResponse(ApiResponseWithType(BooleanProperty))
  updatePost(
    @Request() authHeader: AuthRequest,
    @Param('postId') postId: string,
    @Body() request: IModifyPostRequest
  ): boolean {
    const userId = authHeader.user?.userId ?? null;
    return this.postService.updatePost(postId, userId, request);
  }

  @UseGuards(AuthGuard)
  @Delete(':postId')
  @ApiBearerAuth()
  @ApiResponse(ApiResponseWithType(BooleanProperty))
  removePost(
    @Request() authHeader: AuthRequest,
    @Param('postId') postId: string
  ): boolean {
    const userId = authHeader.user?.userId ?? null;
    return this.postService.removePost(postId, userId);
  }

  @UseGuards(AuthGuard)
  @Post(':postId/comment')
  @ApiBearerAuth()
  @ApiResponse(ApiResponseWithType(BooleanProperty))
  addComment(
    @Request() authHeader: AuthRequest,
    @Param('postId') postId: string,
    @Body() request: IAddCommentRequest
  ) {
    const userId = authHeader.user?.userId ?? null;
    return this.postService.addComment(postId, userId, request.comment);
  }
}
