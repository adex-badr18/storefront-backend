import supertest from "supertest"
import app from '../../server'
import dotenv from 'dotenv'
import { Product } from '../../models/product';
import { User } from '../../models/user';
import { Order, OrderStore } from "../../models/order";
import client from '../../database';

dotenv.config()

const request = supertest(app);
const orderStore = new OrderStore();
let token: string;

fdescribe('Order Handlers Test Suite', () => {
  const product: Product = {
    name: "Product1",
    price: 22000,
    category: "Product-Category"
  };

  const user: User = {
    firstName: 'firstName',
    lastName: 'lastName',
    username: 'user1',
    password: 'password',
  };

  const order: Order = {
    product_id: 1,
    quantity: 3,
    user_id: 1,
    status: "active"
  };

  beforeAll(async () => {
    try {
      const conn = await client.connect();
      const query = 'TRUNCATE products, orders, users RESTART IDENTITY';
      const result = await conn.query(query);
      conn.release();
    } catch (error) {
      throw new Error(`${error}`);
    }

    // Create a new user
    await request.post('/user/signup').send(user);

    // Authenticate the new user
    await request.post('/user/login')
      .send({ username: user.username, password: user.password })
      .then((res) => {
        token = res.body.accessToken;
      });

    // Create a new product
    await request.post('/product/create').send(product).set('Authorization', `Bearer ${token}`);
  });

  beforeEach(function () {
    const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });

  it('/order/create endpoint should return status of 201', async () => {

    const res = await request.post('/order/create').send(order).set('Authorization', `Bearer ${token}`);
    const newOrder: Order = res.body;
    console.log(res.body);
    expect(res.status).toBe(201);
    expect(newOrder.product_id).toEqual(1);
  });

  it('/order/1 endpoint returns a status of 200', (done) => {
    const res = request.get('/order/1')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('/orders endpoint returns a list of order(s)', (done) => {
    const res = request.get('/orders')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.body[0].user_id).toEqual(1);
        done();
      });
  });

  it('/orders/complete endpoint returns a status of 404', (done) => {
    const res = request.get('/orders/complete')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });

  it('/order/delete/3 endpoint returns a status of 200', (done) => {
    const res = request.delete('/order/delete/3')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });

  it('/orders/active/1 endpoint returns a status of 200', (done) => {
    const res = request.get('/orders/active/1')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(200);
        done();
      });
  });

  it('/orders/completed/1 endpoint returns a status of 404', (done) => {
    const res = request.get('/orders/completed/1')
      .set('Authorization', `Bearer ${token}`)
      .then((res) => {
        expect(res.status).toBe(404);
        done();
      });
  });
});
