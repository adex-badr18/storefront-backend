"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.token = void 0;
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const dotenv_1 = __importDefault(require("dotenv"));
const database_1 = __importDefault(require("../../database"));
dotenv_1.default.config();
const request = (0, supertest_1.default)(server_1.default);
let token, user_id;
exports.token = token;
describe('User Handlers', () => {
    const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'user1',
        password: 'password',
    };
    beforeAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const query = 'TRUNCATE products, orders, users RESTART IDENTITY';
            const result = await conn.query(query);
            conn.release();
            //
        }
        catch (error) {
            throw new Error();
        }
    });
    beforeEach(function () {
        const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it('/user/signup endpoint should return status of 200', async () => {
        const res = await request.post('/user/signup').send(user);
        const newUser = res.body.user;
        user_id = newUser.id;
        expect(res.status).toBe(200);
        expect(newUser.id).toEqual(1);
    });
    it('/user/login endpoint returns a status of 200', (done) => {
        const res = request.post('/user/login')
            .send({ username: user.username, password: user.password })
            .then((res) => {
            exports.token = token = res.body.accessToken;
            expect(res.status).toBe(200);
            expect(token).toBeTruthy();
            done();
        });
    });
    it('/users endpoint returns a list of user(s)', (done) => {
        const res = request.get('/users')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body).toBeTruthy();
            done();
        });
    });
    it('/user/user1 endpoint returns a status of 200', (done) => {
        const res = request.get('/user/user1')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
    it('/user/delete/user2 endpoint returns a status of 200', (done) => {
        const res = request.delete('/user/delete/user2')
            .set('Authorization', `Bearer ${token}`)
            .then((res) => {
            expect(res.status).toBe(404);
            done();
        });
    });
});
