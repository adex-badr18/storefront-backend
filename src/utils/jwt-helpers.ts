import jwt from 'jsonwebtoken';
import { User } from '../models/user'

function jwtTokens({ id, firstName, lastName, username }: User) {
    const user = { id, firstName, lastName, username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '5m' });
    return { accessToken };
}

export { jwtTokens };