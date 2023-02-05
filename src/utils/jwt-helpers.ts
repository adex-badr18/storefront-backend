import jwt from 'jsonwebtoken';
import { User } from '../models/user'

function jwtTokens(user: User) {
    // const user = { id, firstName, lastName, username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET!, { expiresIn: '2h' });
    return { accessToken };
}

export { jwtTokens };