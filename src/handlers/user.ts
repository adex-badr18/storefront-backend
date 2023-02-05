import express, { NextFunction, Request, Response } from 'express';
import { User, Users } from '../models/user';
import jwt from 'jsonwebtoken'
import verifyAuthToken from '../middleware/verifyAuthToken';
import verifyUserUpdate from '../middleware/verifyAuthToken';
import { jwtTokens } from '../utils/jwt-helpers';

const userStore = new Users();

// -------Beginning of handler functions
const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const allUsers = await userStore.getAllUsers();
        if (allUsers === null) {
            return res.send('Found zero record.');
        }
        res.json(allUsers);
    } catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};

const getUserByUsername = async (req: Request, res: Response) => {
    const user = await userStore.getUserByUsername(req.params.username);
    try {
        if (user === null) {
            return res.send('Found zero record.');
        }
        res.json(user);
    } catch (err) {
        let msg = (err as Error).message;
        res.json({ error: msg });
    }
};

const createUser = async (req: Request, res: Response) => {
    const user: User = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    };

    try {
        const newUser = await userStore.createUser(user);
        res.json({ user: newUser });
    } catch (err) {
        let msg = (err as Error).message;
        res.status(400).json({ err: msg });
    }
};

const authenticate = async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = await userStore.authenticate(username, password);
    // console.log({ user: user });
    if (user !== null) {
        let token = jwtTokens(user);
        return res.status(200).json(token);
    } else {
        return res.json('Invalid Credentials');
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await userStore.deleteUser(req.params.username);
        if (deleted === null) return res.json({ error: `Unable to delete user "${req.params.username}"` })
        res.json(deleted);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// UPDATE ROUTE
// const updateUser = async (req: Request, res: Response) => {
//     const user: User = {
//         firstName: req.body.firstName,
//         lastName: req.body.lastName,
//         username: req.body.username
//     };
//     const user_id = +req.params.user_id;
//     try {
//         const updated = await userStore.updateUser(user, user_id);
//         if (updated === null) {
//             return res.json({ error: `Could not update user with id ${user_id}` })
//         }
//         res.json(updated);
//     } catch (err) {
//         res.status(400).json(err)
//     }
// }
// ------End of handler functions

// ------Express routes start
const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, getAllUsers);
    app.get('/user/:username', verifyAuthToken, getUserByUsername);
    app.post('/user/signup', createUser);
    app.delete('/user/delete/:username', verifyAuthToken, deleteUser);
    // app.put('/user/update', verifyAuthToken, updateUser);
    app.post('/user/login', authenticate);
};
// ------Express routes end

export default user_routes;
