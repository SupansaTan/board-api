import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class ISignInRequest {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;
}

export class ISignInResponse {
  @ApiProperty()
  accessToken: string;
}