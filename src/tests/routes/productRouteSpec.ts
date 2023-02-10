import supertest from 'supertest';
import app from '../../server';
import dotenv from 'dotenv';
import { token } from './userRouteSpec';
import { Product } from '../../models/product';
import client from '../../database';

dotenv.config();

const request = supertest(app);

describe('Product Handlers Test Suite', () => {
  const product: Product = {
    name: 'Product1',
    price: 22000,
    category: 'Product-Category'
  };
  beforeAll(async () => {
    try {
      const conn = await client.connect();
      const query = 'TRUNCATE products, orders, users RESTART IDENTITY';
      const result = await conn.query(query);
      conn.release();
      //
    } catch (error) {
      throw new Error(`${error}`);
    }
  });

  beforeEach(function () {
    const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('/product/create endpoint should return status of 201', async () => {
    const res = await request
      .post('/product/create')
      .send(product)
      .set('Authorization', `Bearer ${token}`);
    const newProduct: Product = res.body;
    expect(res.status).toBe(201);
    expect(res.body.name).toEqual('Product1');
  });

  it('/products/ProductCategory endpoint returns a status of 404', (done) => {
    const res = request.get('/products/ProductCategory').then((res) => {
      expect(res.status).toBe(404);
      done();
    });
  });

  it('/products endpoint returns a list of product(s)', (done) => {
    const res = request.get('/products').then((res) => {
      expect(res.status).toBe(200);
      expect(res.body[0].category).toEqual('Product-Category');
      done();
    });
  });

  it('/product/1 endpoint returns a status of 200', (done) => {
    const res = request.get('/product/1').then((res) => {
      expect(res.status).toBe(200);
      expect(res.body.id).toEqual(1);
      done();
    });
  });

  it('/product/delete/1 endpoint returns a status of 200', (done) => {
    const res = request
      .delete('/product/delete/1')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });
});
