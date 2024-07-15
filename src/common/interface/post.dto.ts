import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { Community } from "../enum/community.enum";
import { IComment } from "./comment.dto";

export class IPost {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsString()
  postTitle: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(Community)
  community: Community;

  @ApiProperty()
  @IsString()
  createBy: string; // uuid

  @ApiProperty()
  @IsDate()
  createDate: Date;
}

export class IGetPostListRequest {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNumber()
  @IsOptional()
  community?: number;

  @ApiProperty()
  @IsBoolean()
  isOnlyUserPost: boolean;
}

export class IModifyPostRequest {
  @ApiProperty()
  @IsString()
  postTitle: string;

  @ApiProperty()
  @IsString()
  content: string;
}

export class IPostInfo {
  @ApiProperty()
  @IsString()
  postId: string;

  @ApiProperty()
  @IsString()
  postTitle: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsEnum(Community)
  community: Community;

  @ApiProperty()
  @IsString()
  createBy: string; // username

  @ApiProperty()
  @IsDate()
  createDate: Date;

  @ApiProperty()
  @IsNumber()
  totalComments: number;

  @ApiProperty({
    isArray: true,
    type: IComment
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  comments?: IComment[];
}