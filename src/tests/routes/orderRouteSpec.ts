import supertest from 'supertest';
import app from '../../server';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { Order } from '../../models/order';
import client from '../../database';

const request = supertest(app);
let token: string;

describe('Order Handlers Test Suite', () => {
  beforeAll(async () => {
    try {
      const conn = await client.connect();
      const deleteQuery =
        'TRUNCATE order_products, orders, products, users RESTART IDENTITY';
      await conn.query(deleteQuery);
      conn.release();
    } catch (error) {
      throw new Error(`${error}`);
    }
  });

  afterAll(async () => {
    try {
      const conn = await client.connect();
      const deleteQuery =
        'TRUNCATE order_products, orders, products, users RESTART IDENTITY';
      await conn.query(deleteQuery);
      conn.release();
    } catch (error) {
      throw new Error(`${error}`);
    }
  });

  it('Create a user and product and authenticate the user', async () => {
    const user: User = {
      firstName: 'firstname',
      lastName: 'lastname',
      username: 'user1',
      password: 'password1'
    };

    const product: Product = {
      name: 'Product1',
      price: 22000,
      category: 'Category'
    };

    // create a user
    await request.post('/user/signup').send(user);

    // authenticate the new user to generate a token
    const res = await request
      .post('/user/login')
      .send({ username: user.username, password: user.password });
    token = res.body.accessToken;

    // create a new product
    await request
      .post('/product/create')
      .send(product)
      .set('Authorization', `Bearer ${token}`);
    expect(token).toBeTruthy();
    expect(res.status).toBe(200);
  });

  it('/order/create endpoint should return status of 201', async () => {
    const order: Order = {
      user_id: 1,
      status: 'active',
      products: [
        {
          id: 1,
          quantity: 5,
          name: 'Product1',
          price: 22000
        }
      ]
    };
    const res = await request
      .post('/order/create')
      .send(order)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json');
    expect(res.status).toBe(201);
    expect(res.body.id).toEqual(1);
  });

  it('/order/1 endpoint returns a status of 200', async () => {
    const res = await request
      .get('/order/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('/orders endpoint returns a list of order(s)', async () => {
    const res = await request
      .get('/orders')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body[0].user_id).toEqual(1);
  });

  it('/orders/complete endpoint returns a status of 404', async () => {
    const res = await request
      .get('/orders/complete')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(404);
  });

  it('/orders/completed/1 endpoint returns a status of 404', async () => {
    const res = await request
      .get('/orders/completed/1')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });

  it('/orders/active/1 endpoint returns a status of 200', async () => {
    const res = await request
      .get('/orders/active/1')
      .set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
  });

  it('/order/delete/3 endpoint returns a status of 200', async () => {
    const res = await request
      .delete('/order/delete/3')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(404);
  });
});
