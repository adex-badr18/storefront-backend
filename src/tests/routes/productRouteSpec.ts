import supertest from 'supertest';
import app from '../../server';
import { Product } from '../../models/product';
import { User } from '../../models/user';
import client from '../../database';

const request = supertest(app);
let token: string;

describe('Product Handler Test Suite', () => {
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

  it('Create and authenticate a user', async () => {
    const user: User = {
      firstName: 'firstname',
      lastName: 'lastname',
      username: 'user1',
      password: 'password1'
    };

    await request.post('/user/signup').send(user);
    const res = await request
      .post('/user/login')
      .send({ username: user.username, password: user.password });
    token = res.body.accessToken;
    expect(token).toBeDefined();
  });

  it('/product/create endpoint should return status of 201', async () => {
    const product: Product = {
      name: 'Product1',
      price: 22000,
      category: 'Product-Category'
    };

    const res = await request
      .post('/product/create')
      .send(product)
      .set('Authorization', `Bearer ${token}`);
    const newProduct: Product = res.body;
    expect(res.status).toBe(201);
    expect(token).toBeTruthy();
    expect(newProduct.name).toEqual('Product1');
  });

  it('/products/ProductCategory endpoint returns a status of 404', (done) => {
    request.get('/products/ProductCategory').then((res) => {
      expect(res.status).toBe(404);
      done();
    });
  });

  it('/products endpoint returns a list of product(s)', (done) => {
    request.get('/products').then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].category).toEqual('Product-Category');
      done();
    });
  });

  it('/product/1 endpoint returns a status of 200', (done) => {
    request.get('/product/1').then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(1);
      done();
    });
  });

  it('/product/delete/1 endpoint returns a status of 200', (done) => {
    request
      .delete('/product/delete/1')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
