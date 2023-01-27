import jwt, { JwtPayload } from "jsonwebtoken";
import express, { Request, Response, NextFunction } from 'express';
import { User } from "../models/user";

const verifyAuthToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];

        if (token === null) return res.status(401).json({ error: "Null token." });
        jwt.verify(token!, process.env.ACCESS_TOKEN_SECRET!, (error, user) => {
            if (error) return res.status(403).json({ error: error.message });
            req.body.user = user;
            next();
        })

        // jwt.verify(token || '', process.env.SECRET_TOKEN!); // '' in case of undefined, which implies no token; thus unauthorized
        // next();
    } catch (error) {
        return res.status(401).json(`Access denied, invalid token: ${error}`);
    }
};

const verifyUserUpdate = (req: Request, res: Response, next: NextFunction) => {
    const user: User = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    };

    try {
        const authorizationHeader = req.headers.authorization
        const token = authorizationHeader!.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_TOKEN!) as JwtPayload;
        if (decoded!.id !== user.id) {
            throw new Error('User id does not match!')
        }
        next();
    } catch (err) {
        res.status(401)
        res.json(err)
        return
    }
}

export default [verifyAuthToken, verifyUserUpdate];

// try {
//     const authorizationHeader = req.headers.authorization;
//     const token = authorizationHeader!.split(' ')[1];
//     jwt.verify(token, process.env.SECRET_TOKEN!);
// } catch (error) {
//     res.status(401).json(`Access denied! Invalid token: ${error}`);
//     return;
// }

// {
//     "id": "",
//     "firstName": "",
//     "lastName": "",
//     "username": "",
//     "password": ""
// }

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjo5LCJmaXJzdG5hbWUiOiJBbWluYSIsImxhc3RuYW1lIjoiQWRhbSIsInVzZXJuYW1lIjoiYW1uYSIsInBhc3N3b3JkX2hhc2giOiIkMmIkMTAkb3FZa3dsQXlwelh6eC9EZFBmU09mT2g3cVQxSkFHLjM0RzB3NVlRRTlEeWRoMWpnR0w5THEifSwiaWF0IjoxNjc0NTcxMjUzfQ.SNLgdy5jGCc6UT3T6upIYtDeIRQajBOavEmaG-BGEzg