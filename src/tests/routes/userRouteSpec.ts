import supertest from 'supertest';
import app from '../../server';
import { User } from '../../models/user';
import client from '../../database';

const request = supertest(app);
let token: string;
let user_id: number;

describe('User Handler Test Suite', () => {
  const user: User = {
    firstName: 'firstname',
    lastName: 'lastname',
    username: 'user1',
    password: 'password1'
  };

  beforeAll(async () => {
    try {
      const conn = await client.connect();
      const query = 'TRUNCATE orders, products, users RESTART IDENTITY';
      await conn.query(query);
      conn.release();
    } catch (error) {
      throw new Error(`${error}`);
    }
  });

  it('/user/signup endpoint should return status of 200', async () => {
    const res = await request.post('/user/signup').send(user);
    const newUser: User = res.body.user;
    user_id = newUser.id!;
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
