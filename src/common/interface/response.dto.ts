import { ApiProperty } from '@nestjs/swagger';

export class IResponse<T> {
  @ApiProperty()
  statusCode: number;

  @ApiProperty()
  message: string;

  @ApiProperty()
  data: T;
}