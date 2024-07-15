import { CommentService } from './../comment/comment.service';
import { AuthService } from './../auth/auth.service';
import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PostList } from 'src/common/constant/post.constant';
import { IPost, IModifyPostRequest, IPostInfo, IGetPostListRequest } from 'src/common/interface/post.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PostService {
  private readonly postList: IPost[] = PostList;

  constructor(
    private authService: AuthService,
    private commentService: CommentService
  ) {
    this.postList = PostList;
  }

  getPost(request: IGetPostListRequest, userId: string): IPostInfo[] {
    let response: IPost[] = this.postList;
    if (request.isOnlyUserPost) {
      if (!userId) {
        throw new ForbiddenException('You have to login before');
      }

      response = response.filter(p => p.createBy === userId);
    }

    if (request.community) {
      response = response.filter(p => p.community == request.community);
    }

    if (request.title) {
      const title = request.title.split(/\s+/)
        .map(part => part.trim())
        .filter(part => part.length > 0);

      let patternString = "";
      title.forEach((t, index) => {
        if (index === 0) {
          patternString += t;
        } else {
          patternString += `|${t}`;
        }
      })

      const regex = new RegExp(patternString, "i");
      response = response.filter(p => regex.test(p.postTitle));
    }

    let updatedPostInfo: IPostInfo[] = [];
    response.forEach(p => {
      const postInfo: IPostInfo = {
        ...p,
        createBy: this.authService.getUsername(p.createBy),
        totalComments: this.commentService.getTotalComment(p.postId),
      };

      updatedPostInfo.push(postInfo);
    });

    const sortedPost = updatedPostInfo.sort((prev, curr) =>
      prev.createDate.getTime() - curr.createDate.getTime()
    );

    return sortedPost;
  }

  getPostById(postId: string): IPostInfo {
    const postInfo = this.postList.find(p => p.postId === postId);
    if (!postInfo) {
      throw new NotFoundException('Post not found');
    }

    const updatedPostInfo: IPostInfo = {
      ...postInfo,
      createBy: this.authService.getUsername(postInfo.createBy),
      totalComments: this.commentService.getTotalComment(postInfo.postId),
      comments: this.commentService.getCommentList(postInfo.postId),
    };

    return updatedPostInfo;
  }

  addPost(userId: string, postDetail: IModifyPostRequest): boolean {
    let newPost = new IPost();
    newPost.postId = uuid();
    newPost.postTitle = postDetail.postTitle;
    newPost.content = postDetail.content;
    newPost.createBy = userId;
    newPost.createDate = new Date();

    this.postList.push(newPost);
    return true;
  }

  updatePost(postId: string, userId: string, postDetail: IModifyPostRequest): boolean {
    let postInfo = this.postList.find(p => p.postId === postId);
    if (!postInfo) {
      throw new NotFoundException('Post not found');
    }

    if (postInfo.createBy !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }

    const indexToModified = this.postList.indexOf(postInfo);
    if (indexToModified >= 0) {
      postInfo.postTitle = postDetail.postTitle;
      postInfo.content = postDetail.content;
      return true;
    } else {
      throw new NotFoundException('Post not found');
    }
  }

  removePost(postId: string, userId: string): boolean {
    let postInfo = this.postList.find(p => p.postId === postId);
    if (!postInfo) {
      throw new NotFoundException('Post not found');
    }

    if (postInfo.createBy !== userId) {
      throw new ForbiddenException('You are not the owner of this post');
    }

    const indexToRemove = this.postList.indexOf(postInfo);
    if (indexToRemove >= 0) {
      this.postList.splice(indexToRemove, 1);
      return true;
    } else {
      throw new NotFoundException('Post not found');
    }
  }

  addComment(postId: string, userId: string, comment: string): boolean {
    if (!this.isPostExist(postId)) {
      throw new NotFoundException('Post not found');
    }

    return this.commentService.addComment(postId, userId, comment);
  }

  isPostExist(postId: string) {
    return this.postList.some(p => p.postId === postId);
  }
}
