import { Community } from "../enum/community.enum";
import { IPost } from "../interface/post.dto";

export const PostList: IPost[] = [
  {
    postId: 'af588fe5-d25b-4535-a519-9675e50487d1',
    postTitle: 'Testing',
    content: 'Testing long content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content',
    community: Community.Fashion,
    createBy: '85628c83-8e31-4a04-9d8d-b8bd63494b85',
    createDate: new Date()
  },
  {
    postId: '96ae80c2-c708-4233-acf0-5311691c263f',
    postTitle: 'Testing 02',
    content: 'Testing content',
    community: Community.Food,
    createBy: '85628c83-8e31-4a04-9d8d-b8bd63494b85',
    createDate: new Date()
  }
]