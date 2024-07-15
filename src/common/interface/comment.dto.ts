import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsString } from "class-validator";

export class IComment {
  @ApiProperty()
  @IsString()
  commentId: string;

  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsString()
  commentBy: string;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiProperty()
  @IsDate()
  createDate: Date;
}

export class IAddCommentRequest {
  @ApiProperty()
  @IsString()
  comment: string;
}