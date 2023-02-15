"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const database_1 = __importDefault(require("../../database"));
const request = (0, supertest_1.default)(server_1.default);
let token;
let user_id;
describe('User Handler Test Suite', () => {
    const user = {
        firstName: 'firstname',
        lastName: 'lastname',
        username: 'user1',
        password: 'password1'
    };
    beforeAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const query = 'TRUNCATE orders, products, users RESTART IDENTITY';
            await conn.query(query);
            conn.release();
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
    it('/user/signup endpoint should return status of 200', async () => {
        const res = await request.post('/user/signup').send(user);
        const newUser = res.body.user;
        user_id = newUser.id;
        expect(res.status).toBe(200);
        expect(newUser.id).toEqual(1);
    });
    it('/user/login endpoint returns a status of 200', async () => {
        const res = await request
            .post('/user/login')
            .send({ username: user.username, password: user.password });
        token = res.body.accessToken;
        expect(res.status).toBe(200);
        expect(token).toBeTruthy();
    });
    it('/users endpoint returns a status of 200', async () => {
        const res = await request
            .get('/users')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body[0].id).toEqual(user_id);
    });
    it('/user/user1 endpoint returns a status of 200', async () => {
        const res = await request
            .get('/user/user1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    it('/user/delete/user2 endpoint returns a status of 200', async () => {
        const res = await request
            .delete('/user/delete/user2')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
});
