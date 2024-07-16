import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { commentList } from '../common/constant/comment.constant';
import { IComment } from '../common/interface/comment.dto';
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
      commentBy: this.authService.getUsername(c.commentBy),
    }));

    const sortedCommenet = updatedComment.sort((prev, curr) =>
      curr.createDate.getTime() - prev.createDate.getTime()
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
    newComment.commentBy = userId;

    this.commentList.push(newComment);
    return true;
  }
}
