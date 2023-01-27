"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const verifyAuthToken_2 = __importDefault(require("../middleware/verifyAuthToken"));
const jwt_helpers_1 = require("../utils/jwt-helpers");
const userStore = new user_1.Users();
// -------Beginning of handler functions
const getAllUsers = async (_req, res) => {
    try {
        const allUsers = await userStore.getAllUsers();
        if (!allUsers) {
            return res.send('Found zero record.');
        }
        res.json(allUsers);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const getUserByUsername = async (req, res) => {
    const user = await userStore.getUserByUsername(req.params.username);
    try {
        if (user) {
            return res.json(user);
        }
        res.send('Found zero record.');
    }
    catch (err) {
        let msg = err.message;
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
        let msg = err.message;
        res.status(400).json({ err: msg });
    }
};
const authenticate = async (req, res) => {
    // const { username, password } = req.body;
    const username = req.body.username;
    const password = req.body.password;
    const user = await userStore.authenticate(username, password);
    if (user !== null) {
        let token = (0, jwt_helpers_1.jwtTokens)(user);
        return res.status(200).json(token);
    }
    else {
        return res.json('Invalid Credentials');
    }
};
const deleteUser = async (req, res) => {
    try {
        const user = {
            id: req.body.id,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: req.body.password
        };
        const deleted = await userStore.deleteUser(user);
        res.json(deleted);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// UPDATE ROUTE
const updateUser = async (req, res) => {
    const user = {
        id: req.body.id,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        password: req.body.password
    };
    const updated = await userStore.updateUser(user);
    res.json(updated);
    try {
        res.send('this is the EDIT route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// ------End of handler functions
// ------Express routes start
const user_routes = (app) => {
    app.get('/users', verifyAuthToken_1.default, getAllUsers);
    app.get('/user/:username', verifyAuthToken_1.default, getUserByUsername);
    app.post('/user/signup', createUser);
    app.delete('/user/delete', verifyAuthToken_1.default, deleteUser);
    app.put('/user/update/:username', verifyAuthToken_1.default, verifyAuthToken_2.default, updateUser);
    app.post('/user/login', authenticate);
};
// ------Express routes end
exports.default = user_routes;
