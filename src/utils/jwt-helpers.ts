import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

function jwtTokens(user: User) {
  const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '10h'
  });
  return { accessToken };
}

export { jwtTokens };
