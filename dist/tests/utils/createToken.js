"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
dotenv_1.default.config();
const request = (0, supertest_1.default)(server_1.default);
const user = {
    id: 1,
    firstName: 'firstname',
    lastName: 'lastname',
    username: 'user2',
    password: 'password2'
};
const generateToken = async () => {
    // create a new user
    await request.post('/user/signup').send(user);
    // authenticate the new user
    const token = await request.post('/user/login').send({ username: user.username, password: user.password });
    return { token };
};
exports.generateToken = generateToken;
console.log(generateToken());
