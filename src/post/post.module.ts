import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { JwtService } from '@nestjs/jwt';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthService } from 'src/auth/auth.service';
import { CommentService } from 'src/comment/comment.service';

@Module({
  imports: [
    CacheModule.register(),
  ],
  providers: [
    PostService,
    JwtService,
    AuthService,
    CommentService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    }
  ],
  exports: [
    PostService
  ],
  controllers: [PostController]
})
export class PostModule { }
