import { AuthService } from 'src/auth/auth.service';
import { CommentService } from './comment.service';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PostService } from 'src/post/post.service';

@Module({
  providers: [
    CommentService,
    AuthService,
    JwtService,
    PostService,
  ]
})
export class CommentModule { }
