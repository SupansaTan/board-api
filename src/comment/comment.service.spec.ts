import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { v4 as uuid } from 'uuid';
import { IComment } from '../common/interface/comment.dto';
import { AuthService } from '../auth/auth.service';

describe('CommentService', () => {
  let commentService: CommentService;
  let authService: AuthService;

  const mockComments: IComment[] = [
    {
      commentId: uuid(),
      postId: '1',
      commentBy: 'user1',
      comment: 'First comment',
      createDate: new Date('2023-01-01'),
    },
    {
      commentId: uuid(),
      postId: '1',
      commentBy: 'user2',
      comment: 'Second comment',
      createDate: new Date('2023-01-02'),
    },
  ];

  const mockAuthService = {
    getUsername: jest.fn((userId: string) => `username-${userId}`),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    commentService = module.get<CommentService>(CommentService);
    authService = module.get<AuthService>(AuthService);
    (commentService as any).commentList = mockComments;
  });

  it('should be defined', () => {
    expect(commentService).toBeDefined();
  });

  describe('getCommentList', () => {
    it('should return comment list with the given postId and sorted by date', () => {
      const result = commentService.getCommentList('1');
      expect(result).toEqual([
        {
          ...mockComments[1],
          commentBy: 'username-user2',
        },
        {
          ...mockComments[0],
          commentBy: 'username-user1',
        },
      ]);
    });
  });

  describe('getTotalComment', () => {
    it('should return the total number of comments for a given postId', () => {
      const result = commentService.getTotalComment('1');
      expect(result).toBe(2);
    });

    it('should return 0 if no comments are found for a given postId', () => {
      const result = commentService.getTotalComment('2');
      expect(result).toBe(0);
    });
  });

  describe('addComment', () => {
    it('should add a new comment to the commentList', () => {
      const postId = '1';
      const userId = 'user3';
      const commentText = 'New comment';

      const result = commentService.addComment(postId, userId, commentText);
      expect(result).toBe(true);
      expect((commentService as any).commentList).toHaveLength(3);

      const newComment = (commentService as any).commentList[2];
      expect(newComment.postId).toBe(postId);
      expect(newComment.commentBy).toBe(userId);
      expect(newComment.comment).toBe(commentText);
    });
  });
});
