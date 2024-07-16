import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { AuthRequest } from '../common/interface/auth.dto';
import { IGetPostListRequest, IModifyPostRequest, IPostInfo } from '../common/interface/post.dto';
import { PostService } from './post.service';
import { AuthGuard } from '../auth/auth.guard';
import { CacheInterceptor } from '@nestjs/cache-manager';
import { of } from 'rxjs';
import { IAddCommentRequest } from 'src/common/interface/comment.dto';

describe('PostController', () => {
  let postController: PostController;
  let postService: PostService;

  const mockPostService = {
    getPost: jest.fn(),
    getPostById: jest.fn(),
    addPost: jest.fn(),
    updatePost: jest.fn(),
    removePost: jest.fn(),
    addComment: jest.fn(),
  };

  const mockAuthRequest = {
    user: { userId: 'user123', username: 'username test' },
    headers: {},
  };

  const mockPost: IPostInfo = {
    postId: 'post123',
    postTitle: 'Test Post',
    content: 'Test Content',
    createDate: new Date(),
    createBy: 'username test',
    community: 2,
    totalComments: 0,
    comments: [],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: PostService, useValue: mockPostService },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({ canActivate: jest.fn(() => true) })
      .overrideInterceptor(CacheInterceptor)
      .useValue({ intercept: jest.fn((context, next) => next.handle().pipe(of([]))) })
      .compile();

    postController = module.get<PostController>(PostController);
    postService = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(postController).toBeDefined();
  });

  describe('getPost', () => {
    it('should return a list of posts', () => {
      const request: IGetPostListRequest = {
        title: 'test',
        isOnlyUserPost: false
      };

      const posts: IPostInfo[] = [mockPost];
      jest.spyOn(postService, 'getPost').mockReturnValue(posts);

      expect(postController.getPost(mockAuthRequest as any, request)).toEqual(posts);
      expect(postService.getPost).toHaveBeenCalledWith(request, 'user123');
    });
  });

  describe('getPostById', () => {
    it('should return a single post by id', () => {
      jest.spyOn(postService, 'getPostById').mockReturnValue(mockPost);

      expect(postController.getPostById('post123')).toEqual(mockPost);
      expect(postService.getPostById).toHaveBeenCalledWith('post123');
    });
  });

  describe('addPost', () => {
    it('should add a post', () => {
      const request: IModifyPostRequest = new IModifyPostRequest();
      jest.spyOn(postService, 'addPost').mockReturnValue(true);

      expect(postController.addPost(mockAuthRequest as any, request)).toBe(true);
      expect(postService.addPost).toHaveBeenCalledWith('user123', request);
    });
  });

  describe('updatePost', () => {
    it('should update a post', () => {
      const request: IModifyPostRequest = {
        postTitle: mockPost.postId,
        content: `${mockPost.content} test`,
        community: mockPost.community
      }
      jest.spyOn(postService, 'updatePost').mockReturnValue(true);

      expect(postController.updatePost(mockAuthRequest as any, 'post123', request)).toBe(true);
      expect(postService.updatePost).toHaveBeenCalledWith('post123', 'user123', request);
    });
  });

  describe('removePost', () => {
    it('should remove a post', () => {
      jest.spyOn(postService, 'removePost').mockReturnValue(true);

      expect(postController.removePost(mockAuthRequest as any, 'post123')).toBe(true);
      expect(postService.removePost).toHaveBeenCalledWith('post123', 'user123');
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', () => {
      const request: IAddCommentRequest = { comment: 'Test comment' };
      jest.spyOn(postService, 'addComment').mockReturnValue(true);

      expect(postController.addComment(mockAuthRequest as any, 'post123', request)).toBe(true);
      expect(postService.addComment).toHaveBeenCalledWith('post123', 'user123', 'Test comment');
    });
  });
});
