import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { AuthService } from '../auth/auth.service';
import { CommentService } from '../comment/comment.service';
import { IGetPostListRequest, IModifyPostRequest, IPost } from 'src/common/interface/post.dto';
import { v4 as uuid } from 'uuid';
import { ForbiddenException, NotFoundException } from '@nestjs/common';

describe('PostService', () => {
  let postService: PostService;
  let authService: AuthService;
  let commentService: CommentService;

  const mockAuthService = {
    getUsername: jest.fn((userId: string) => `username-${userId}`),
  };

  const mockCommentService = {
    getTotalComment: jest.fn(() => 5),
    getCommentList: jest.fn(() => []),
    addComment: jest.fn(() => true),
  };

  const mockPosts: IPost[] = [
    {
      postId: uuid(),
      postTitle: 'Test Post',
      content: 'Test Content',
      createBy: 'user123',
      createDate: new Date('2023-01-01'),
      community: 1,
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: AuthService, useValue: mockAuthService },
        { provide: CommentService, useValue: mockCommentService },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    authService = module.get<AuthService>(AuthService);
    commentService = module.get<CommentService>(CommentService);
    (postService as any).postList = mockPosts;
  });

  it('should be defined', () => {
    expect(postService).toBeDefined();
  });

  describe('getPost', () => {
    it('should return a list of posts', () => {
      const request: IGetPostListRequest = { isOnlyUserPost: false, community: 1, title: '' };
      const result = postService.getPost(request, 'user123');
      expect(result).toHaveLength(1);
      expect(result[0]).toMatchObject({
        ...mockPosts[0],
        createBy: 'username-user123',
        totalComments: 5,
      });
    });

    it('should throw ForbiddenException if isOnlyUserPost is true and user is not logged in', () => {
      const request: IGetPostListRequest = { isOnlyUserPost: true, community: null, title: '' };
      expect(() => postService.getPost(request, null)).toThrow(ForbiddenException);
    });
  });

  describe('getPostById', () => {
    it('should return a single post by id', () => {
      const result = postService.getPostById(mockPosts[0].postId);
      expect(result).toMatchObject({
        ...mockPosts[0],
        createBy: 'username-user123',
        totalComments: 5,
        comments: [],
      });
    });

    it('should throw NotFoundException if post is not found', () => {
      expect(() => postService.getPostById('invalid-id')).toThrow(NotFoundException);
    });
  });

  describe('addPost', () => {
    it('should add a new post', () => {
      const request: IModifyPostRequest = { postTitle: 'New Post', content: 'New Content', community: 1 };
      const result = postService.addPost('user123', request);
      expect(result).toBe(true);
      expect((postService as any).postList).toHaveLength(2);
    });
  });

  describe('updatePost', () => {
    it('should update a post', () => {
      const request: IModifyPostRequest = { postTitle: 'Updated Post', content: 'Updated Content', community: 1 };
      const result = postService.updatePost(mockPosts[0].postId, 'user123', request);
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if post is not found', () => {
      const request: IModifyPostRequest = { postTitle: 'Updated Post', content: 'Updated Content', community: 1 };
      expect(() => postService.updatePost('invalid-id', 'user123', request)).toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner of the post', () => {
      const request: IModifyPostRequest = { postTitle: 'Updated Post', content: 'Updated Content', community: 1 };
      expect(() => postService.updatePost(mockPosts[0].postId, 'user456', request)).toThrow(ForbiddenException);
    });
  });

  describe('removePost', () => {
    it('should remove a post', () => {
      const result = postService.removePost(mockPosts[0].postId, 'user123');
      expect(result).toBe(true);
      expect((postService as any).postList).toHaveLength(1);
    });

    it('should throw NotFoundException if post is not found', () => {
      expect(() => postService.removePost('invalid id', 'user123')).toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not the owner of the post', () => {
      expect(() => postService.removePost(mockPosts[0].postId, 'user456')).toThrow(ForbiddenException);
    });
  });

  describe('addComment', () => {
    it('should add a comment to a post', () => {
      const result = postService.addComment(mockPosts[0].postId, 'user123', 'Test comment');
      expect(result).toBe(true);
    });

    it('should throw NotFoundException if post is not found', () => {
      expect(() => postService.addComment('invalid id', 'user123', 'Test comment')).toThrow(NotFoundException);
    });
  });

  describe('isPostExist', () => {
    it('should return true if post exists', () => {
      const result = postService.isPostExist(mockPosts[0].postId);
      expect(result).toBe(true);
    });

    it('should return false if post does not exist', () => {
      const result = postService.isPostExist('invalid id');
      expect(result).toBe(false);
    });
  });
});
