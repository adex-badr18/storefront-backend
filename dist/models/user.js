"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Users = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const database_1 = __importDefault(require("../database"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = +process.env.SALT_ROUNDS;
class Users {
    async getAllUsers() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const users = await conn.query(sql);
            conn.release();
            if (users.rows.length === 0) {
                return null;
            }
            return users.rows;
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    }
    async getUserByUsername(username) {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const user = await conn.query(sql, [username]);
            conn.release();
            if (user.rows.length === 0)
                return null;
            return user.rows[0];
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    }
    async createUser(u) {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3, $4) RETURNING *';
            const salt = bcrypt_1.default.genSaltSync(saltRounds);
            const hash = bcrypt_1.default.hashSync(u.password, salt);
            const result = await conn.query(sql, [
                u.firstName,
                u.lastName,
                u.username,
                hash
            ]);
            conn.release();
            const user = result.rows[0];
            return user;
        }
        catch (error) {
            throw new Error(`Unable to create user (${u.username}): ${error}`);
        }
    }
    async authenticate(username, password) {
        try {
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users WHERE username=($1)';
            const result = await conn.query(sql, [username]);
            conn.release();
            if (result.rows.length) {
                const user = result.rows[0];
                if (bcrypt_1.default.compareSync(password, user.password)) {
                    return user;
                }
            }
            return null;
        }
        catch (error) {
            throw new Error(`Authentication failed for user (${username}): ${error}`);
        }
    }
    async deleteUser(username) {
        try {
            const sql = 'DELETE FROM users WHERE username=($1) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [username]);
            conn.release();
            if (result.rows.length === 0)
                return null;
            const user = result.rows[0];
            return user;
        }
        catch (err) {
            throw new Error(`Could not delete user. Error: ${err}`);
        }
    }
}
exports.Users = Users;
