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
        if (!allUsers) {
            return res.send('Found zero record.');
        }
        res.json(allUsers);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getUserByUsername = async (req: Request, res: Response) => {
    const user = await userStore.getUserByUsername(req.params.username);
    try {
        if (user) {
            return res.json(user);
        }
        res.send('Found zero record.');
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
    // const { username, password } = req.body;
    const username: string = req.body.username;
    const password: string = req.body.password;
    const user = await userStore.authenticate(username, password);
    if (user !== null) {
        let token = jwtTokens(user);
        return res.status(200).json(token);
    } else {
        return res.json('Invalid Credentials');
    }
};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const user: User = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        };

        const deleted = await userStore.deleteUser(user);
        res.json(deleted);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// UPDATE ROUTE
const updateUser = async (req: Request, res: Response) => {
    const user: User = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    }

    const updated = await userStore.updateUser(user)
    res.json(updated)
    try {
        res.send('this is the EDIT route')
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}
// ------End of handler functions

// ------Express routes start
const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, getAllUsers);
    app.get('/user/:username', verifyAuthToken, getUserByUsername);
    app.post('/user/signup', createUser);
    app.delete('/user/delete', verifyAuthToken, deleteUser);
    app.put('/user/update/:username', verifyAuthToken, verifyUserUpdate, updateUser);
    app.post('/user/login', authenticate);
};
// ------Express routes end

export default user_routes;
