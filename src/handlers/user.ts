import express, { Request, Response } from 'express';
import { User, Users } from '../models/user';
import verifyAuthToken from '../middleware/verifyAuthToken';
import { jwtTokens } from '../utils/jwt-helpers';

const userStore = new Users();

// -------Beginning of handler functions
const getAllUsers = async (_req: Request, res: Response) => {
    try {
        const allUsers = await userStore.getAllUsers();
        if (allUsers === null) {
            return res.status(404).send('Found zero record.');
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
            return res.status(404).send('Found zero record.');
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
    try {
        const { username, password } = req.body;
        const user = await userStore.authenticate(username, password);
        // console.log({ user: user });
        if (user !== null) {
            let token = jwtTokens(user);
            return res.status(200).json(token);
        } else {
            return res.status(404).json('Invalid login details');
        }
    } catch (error) {
        res.json(`An error occurred: ${error}`)
    }

};

const deleteUser = async (req: Request, res: Response) => {
    try {
        const deleted = await userStore.deleteUser(req.params.username);
        if (deleted === null) return res.status(404).json({ error: `"${req.params.username}" not found.` })
        res.json(deleted);
    } catch (err) {
        res.status(400).json(err);
    }
};
// ------End of handler functions

// ------Express routes start
const user_routes = (app: express.Application) => {
    app.get('/users', verifyAuthToken, getAllUsers);
    app.get('/user/:username', verifyAuthToken, getUserByUsername);
    app.post('/user/signup', createUser);
    app.delete('/user/delete/:username', verifyAuthToken, deleteUser);
    app.post('/user/login', authenticate);
};
// ------Express routes end

export default user_routes;
