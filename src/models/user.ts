import bcrypt from 'bcrypt';
import client from '../database';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = +process.env.SALT_ROUNDS!;

export type User = {
  id?: number;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
};

export class Users {
  async getAllUsers(): Promise<User[] | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const users = await conn.query(sql);
      if (users.rows.length === 0) {
        return null;
      }
      conn.release();
      return users.rows;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getUserByUsername(username: string): Promise<User | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const user = await conn.query(sql, [username]);
      conn.release();
      if (user.rows.length === 0) return null;
      return user.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async createUser(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (firstName, lastName, username, password) VALUES ($1, $2, $3, $4) RETURNING *';
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(u.password!, salt);

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.username,
        hash
      ]);
      const user = result.rows[0];

      conn.release();
      return user;
    } catch (error) {
      throw new Error(`Unable to create user (${u.username}): ${error}`);
    }
  }

  async authenticate(username: string, password: string): Promise<User | null> {
    try {
      const connection = await client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const result = await connection.query(sql, [username]);

      if (result.rows.length) {
        const user = result.rows[0];
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Authentication failed for user (${username}): ${error}`);
    }

  }

  async deleteUser(username: string): Promise<User | null> {
    try {
      const sql = 'DELETE FROM users WHERE username=($1) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [username]);

      if (result.rows.length === 0) return null

      const user = result.rows[0];

      conn.release();

      return user;
    } catch (err) {
      throw new Error(`Could not delete user. Error: ${err}`);
    }
  }
}
