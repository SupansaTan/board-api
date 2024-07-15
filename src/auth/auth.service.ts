import { ISignInResponse } from 'src/common/interface/signIn.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { userList } from 'src/common/constant/user.constant';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { jwtConstants } from './constant/jwt.constant';
import { IUser } from 'src/common/interface/user.dto';

@Injectable()
export class AuthService {
  private readonly jwtOptions: JwtSignOptions;
  private readonly usernameList: IUser[] = userList;

  constructor(
    private jwtService: JwtService
  ) {
    this.usernameList = userList;
    this.jwtOptions = {
      secret: jwtConstants.secret,
    };
  }

  login(username: string): ISignInResponse {
    const userInfo = this.usernameList.find((u) => u.username === username);
    if (!userInfo) {
      throw new NotFoundException('User not found');
    }

    return this.generateToken(userInfo);
  }

  generateToken(userInfo: IUser): ISignInResponse {
    const payload = { userId: userInfo.userId, username: userInfo.username };
    let response = new ISignInResponse();
    response.accessToken = this.jwtService.sign(payload, this.jwtOptions);
    return response;
  }

  getUsername(userId: string): string {
    return this.usernameList.find(u => u.userId === userId).username ?? '';
  }
}
