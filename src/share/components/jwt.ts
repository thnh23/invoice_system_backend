import { Inject, Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

import { ITokenProvider, TokenPayload } from '../interface';


@Injectable()
export class JwtTokenService implements ITokenProvider {
  private readonly secretKey: string;
  private readonly expiresIn: string | number;

  constructor(
    secretKey: string,
    expiresIn: string | number,
  ) {
    this.secretKey = secretKey;
    this.expiresIn = expiresIn;
  }
  async isTokenExpried(token: string): Promise<boolean> {
    //get the payload without verifying it
    const decoded = jwt.decode(token);

    if (!decoded || typeof decoded === 'string') {
      throw new Error('Invalid token');
    }

    const currentTime = Math.floor(Date.now() / 1000);
    const expirationTime = decoded.exp;

    if (expirationTime && currentTime > expirationTime) {
      return true;
    }

    return false;
  }


  async generateToken(payload: TokenPayload): Promise<string> {
    return jwt.sign(payload, this.secretKey, { expiresIn: this.expiresIn });
  }

  async verifyToken(token: string): Promise<TokenPayload | null> {
    try {
      const decoded = jwt.verify(token, this.secretKey) as TokenPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }

}