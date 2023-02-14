"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const jwt_helpers_1 = require("../utils/jwt-helpers");
const userStore = new user_1.Users();
// -------Beginning of handler functions
const getAllUsers = async (_req, res) => {
    try {
        const allUsers = await userStore.getAllUsers();
        if (allUsers === null) {
            return res.status(404).send('Found zero record.');
        }
        res.json(allUsers);
    }
    catch (err) {
        console.log(err);
        res.status(400);
        res.json(err);
    }
};
const getUserByUsername = async (req, res) => {
    const user = await userStore.getUserByUsername(req.params.username);
    try {
        if (user === null) {
            return res.status(404).send('Found zero record.');
        }
        res.json(user);
    }
    catch (err) {
        const msg = err.message;
        res.json({ error: msg });
    }
};
const createUser = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    };
    try {
        const newUser = await userStore.createUser(user);
        res.json({ user: newUser });
    }
    catch (err) {
        const msg = err.message;
        res.status(400).json({ err: msg });
    }
};
const authenticate = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await userStore.authenticate(username, password);
        if (user !== null) {
            const token = (0, jwt_helpers_1.jwtTokens)(user);
            res.status(200).json(token);
        }
        else {
            return res.status(404).json('Invalid login details');
        }
    }
    catch (error) {
        return res.json(`An error occurred: ${error}`);
    }
};
const deleteUser = async (req, res) => {
    try {
        const deleted = await userStore.deleteUser(req.params.username);
        if (deleted === null)
            return res
                .status(404)
                .json({ error: `"${req.params.username}" not found.` });
        res.json(deleted);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
};
// ------End of handler functions
// ------Express routes start
const user_routes = (app) => {
    app.get('/users', verifyAuthToken_1.default, getAllUsers);
    app.get('/user/:username', verifyAuthToken_1.default, getUserByUsername);
    app.post('/user/signup', createUser);
    app.delete('/user/delete/:username', verifyAuthToken_1.default, deleteUser);
    app.post('/user/login', authenticate);
};
// ------Express routes end
exports.default = user_routes;
