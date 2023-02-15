"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../models/user");
const database_1 = __importDefault(require("../../database"));
const store = new user_1.Users();
describe('User model test suite', () => {
    beforeAll(async () => {
        const user = {
            firstName: 'User1firstname',
            lastName: 'User1lastname',
            username: 'user1',
            password: 'user123'
        };
        await store.createUser(user);
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
        const sql = 'DELETE FROM users WHERE username IN ($1, $2)';
        await conn.query(sql, ['user1', 'user2']);
        conn.release();
    });
    it('getAllUsers() should not be empty', async () => {
        const users = await store.getAllUsers();
        expect(users).not.toBeNull();
    });
    it('getUserByUsername() should return null', async () => {
        const username = 'username';
        const user = await store.getUserByUsername(username);
        expect(user).toBeNull();
    });
    it('createUser() should return an object', async () => {
        const user = {
            firstName: 'User2firstname',
            lastName: 'User2lastname',
            username: 'user2',
            password: 'user213'
        };
        await store.createUser(user);
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM users WHERE username=($1)';
        const result = await conn.query(sql, [user.username]);
        conn.release();
        expect(result.rows[0]).toBeTruthy();
    });
    it('authenticate() with wrong user info should return null', async () => {
        const user = await store.authenticate('Hyundai', 'Lexus');
        expect(user).toBeNull();
    });
    it('delete() should return an object with username of user2', async () => {
        const username = 'user100';
        const deleted = await store.deleteUser(username);
        expect(deleted).toBeFalsy();
    });
});
