import { User, Users } from '../../models/user';
import client from '../../database';

const store = new Users();

describe('User model test suite', () => {
  beforeAll(async () => {
    const user: User = {
      firstName: 'User1firstname',
      lastName: 'User1lastname',
      username: 'user1',
      password: 'user123'
    };

    await store.createUser(user);
  });

  afterAll(async () => {
    try {
      const conn = await client.connect();
      const query =
        'TRUNCATE order_products, products, orders, users RESTART IDENTITY';
      await conn.query(query);
      conn.release();
    } catch (error) {
      throw new Error(`${error}`);
    }
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
    const user: User = {
      firstName: 'User2firstname',
      lastName: 'User2lastname',
      username: 'user2',
      password: 'user213'
    };

    await store.createUser(user);

    const conn = await client.connect();
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
