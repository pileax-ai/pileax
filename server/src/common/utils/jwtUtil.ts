import jwt, { SignOptions } from 'jsonwebtoken'
import { HttpException } from '@/core/api/exceptions'

export class JwtUtil  {
  static secret = () => {
    const secret = process.env.API_JWT_SECRET;
    if (!secret) {
      throw new HttpException(500, 'Missing JWT secret.');
    }
    return secret;
  }

  static sign(
    payload: string | object | Buffer,
    options?: SignOptions
  ): string {
    const secret = JwtUtil.secret();
    const signOptions: SignOptions = {
      algorithm: 'HS256',
      ...options,
      expiresIn: options?.expiresIn || '30d'
    };

    return jwt.sign(
      payload,
      secret,
      signOptions
    );
  }

  static decode(token: string, complete = false) {
    return jwt.decode(token, { complete });
  }
}
