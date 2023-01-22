import bcrypt from 'bcrypt';
import client from '../database';
import dotenv from 'dotenv';

dotenv.config();

const pepper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

export type User = {
  id: number;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
};

export class Users {
  async index(): Promise<User[]> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users';
      const users = await conn.query(sql);
      conn.release();
      return users.rows;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async show(username: string): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT * FROM users WHERE username=($1)';
      const user = await conn.query(sql, [username]);
      conn.release();
      return user.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async create(u: User): Promise<User> {
    try {
      // @ts-ignore
      const conn = await client.connect();
      const sql =
        'INSERT INTO users (firstName, lastName, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING *';
      const password_hash = bcrypt.hashSync(
        u.password + pepper,
        parseInt(saltRounds!)
      );

      const result = await conn.query(sql, [
        u.firstName,
        u.lastName,
        u.username,
        password_hash
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
      // @ts-ignore
      const conn = await client.connect();
      const sql = 'SELECT password FROM users WHERE username=($1)';
      const result = await conn.query(sql, [username]);

      console.log(password + pepper);

      if (result.rows.length) {
        const user = result.rows[0];
        console.log(user);

        if (bcrypt.compareSync(password + pepper, user.password)) {
          return user;
        }
      }

      return null;
    } catch (error) {
      throw new Error(`Authentication failed for user (${username}): ${error}`);
    }
  }
}
