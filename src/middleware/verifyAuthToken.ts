import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

dotenv.config();
declare let process: {
  env: {
    ACCESS_TOKEN_SECRET: string;
  };
};

const verifyAuthToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization']!;
    const token = authHeader.split(' ')[1];
    jwt.decode(token, { complete: true });
    if (!token) {
      return res.status(401).json({ error: 'Null token.' });
    }
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(403).json({ error: error.message });
      }
      req.body.user = user;
      next();
    });
  } catch (error) {
    return res.status(401).json(`Access denied, invalid token: ${error}`);
  }
};

export default verifyAuthToken;
