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
const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;
class Users {
    async getAllUsers() {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'SELECT * FROM users';
            const users = await conn.query(sql);
            conn.release();
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
            const sql = 'INSERT INTO users (firstName, lastName, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
            const password_hash = bcrypt_1.default.hashSync(u.password + pepper, parseInt(saltRounds));
            const result = await conn.query(sql, [
                u.firstName,
                u.lastName,
                u.username,
                password_hash
            ]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (error) {
            throw new Error(`Unable to create user (${u.username}): ${error}`);
        }
    }
    async authenticate(username, password) {
        const connection = await database_1.default.connect();
        const sql = 'SELECT * FROM users WHERE username=($1)';
        const result = await connection.query(sql, [username]);
        if (result.rows.length) {
            const user = result.rows[0];
            if (bcrypt_1.default.compareSync(password + pepper, user.password)) {
                return user;
            }
            else {
            }
        }
        return null;
    }
    async updateUser(u) {
        try {
            const connection = await database_1.default.connect();
            const sql = "UPDATE users SET firstName=$1, lastName=$2) WHERE username=$3";
            const result = await connection.query(sql, [
                u.firstName,
                u.lastName,
                u.username
            ]);
            const user = result.rows[0];
            connection.release();
            return user;
        }
        catch (error) {
            throw new Error('An error occur while updating product:' + error);
        }
    }
    async deleteUser(u) {
        try {
            const sql = 'DELETE FROM users WHERE username=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [u.username]);
            const user = result.rows[0];
            conn.release();
            return user;
        }
        catch (err) {
            throw new Error(`Could not delete user. Error: ${err}`);
        }
    }
}
exports.Users = Users;
