import { Injectable } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { commentList } from 'src/common/constant/comment.constant';
import { IComment } from 'src/common/interface/comment.dto';
import { v4 as uuid } from 'uuid';

@Injectable()
export class CommentService {
  private readonly commentList: IComment[] = commentList;

  constructor(
    private authService: AuthService
  ) {
    this.commentList = commentList;
  }

  getCommentList(postId: string) {
    const filteredComment = this.commentList.filter(c => c.postId === postId);
    const updatedComment = filteredComment.map((c) => ({
      ...c,
      postBy: this.authService.getUsername(c.postBy),
    }));

    const sortedCommenet = updatedComment.sort((prev, curr) =>
      prev.createDate.getTime() - curr.createDate.getTime()
    );

    return sortedCommenet;
  }

  getTotalComment(postId: string): number {
    return this.commentList.filter(c => c.postId === postId)?.length ?? 0;
  }

  addComment(postId: string, userId: string, comment: string): boolean {
    let newComment = new IComment();
    newComment.commentId = uuid();
    newComment.comment = comment;
    newComment.createDate = new Date();
    newComment.postId = postId;
    newComment.postBy = userId;

    this.commentList.push(newComment);
    return true;
  }
}
