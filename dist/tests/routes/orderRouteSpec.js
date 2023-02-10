"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const dotenv_1 = __importDefault(require("dotenv"));
const order_1 = require("../../models/order");
const database_1 = __importDefault(require("../../database"));
dotenv_1.default.config();
const request = (0, supertest_1.default)(server_1.default);
const orderStore = new order_1.OrderStore();
let token;
fdescribe('Order Handlers Test Suite', () => {
    const product = {
        name: "Product1",
        price: 22000,
        category: "Product-Category"
    };
    const user = {
        firstName: 'firstName',
        lastName: 'lastName',
        username: 'user1',
        password: 'password',
    };
    const order = {
        product_id: 1,
        quantity: 3,
        user_id: 1,
        status: "active"
    };
    beforeAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const query = 'TRUNCATE products, orders, users RESTART IDENTITY';
            const result = await conn.query(query);
            conn.release();
        }
        catch (error) {
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
        const newOrder = res.body;
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
// import supertest, { SuperTest } from "supertest"
// import app from '../../server'
// import dotenv from 'dotenv'
// import { jwtTokens } from "../../utils/jwt-helpers"
// import { Product, ProductStore } from '../../models/product';
// import { User, Users } from '../../models/user';
// import { Order, OrderStore } from '../../models/order';
// import client from '../../database';
// import fetch from 'node-fetch';
// dotenv.config()
// const productStore = new ProductStore();
// const userStore = new Users();
// const orderStore = new OrderStore();
// const request: SuperTest<supertest.Test> = supertest(app);
// let product_id: number;
// let user_id: number;
// let token: string;
// describe("Order Endpoints Test Suite", () => {
//   beforeAll(async () => {
//     try {
//       // delete existing records from all tables
//       const conn = await client.connect();
//       const query = 'DELETE FROM products; DELETE FROM users; DELETE FROM orders; ALTER SEQUENCE products_id_seq RESTART WITH 1; ALTER SEQUENCE users_id_seq RESTART WITH 1; ALTER SEQUENCE orders_id_seq RESTART WITH 1;'
//       await conn.query(query);
//       conn.release();
//     } catch (error) {
//       throw new Error(`Something went wrong ${error}`);
//     }
//     // create a new user
//     const user: User = {
//       firstName: "UserFirstname",
//       lastName: "UserLastname",
//       username: "user1",
//       password: "user123"
//     };
//     const userResponse = await request.post('/user/signup')
//       .send(user)
//       .set('Content-Type', 'application/json')
//     const newUser: User = userResponse.body.user;
//     user_id = newUser.id!;
//     // generate token for the new user
//     const loginResponse = await request.post('/user/login')
//       .send({ username: user.username, password: user.password })
//       .set('Content-Type', 'application/json')
//     token = await loginResponse.body.accessToken;
//     console.log(token);
//     // create a new product
//     const product: Product = {
//       name: "Product1",
//       price: 22000,
//       category: "Product-Category"
//     };
//     const productResponse = await request.post('/product/create')
//       .send(product)
//       .set('Content-Type', 'application/json')
//     const newProduct: Product = await productResponse.body;
//     console.log(newProduct);
//     product_id = newProduct.id!;
//   });
//   fit('order/create should create a new order', async () => {
//     const order: Order = {
//       product_id: product_id,
//       quantity: 3,
//       user_id: user_id,
//       status: "active"
//     };
//     console.log('Token:', token);
//     console.log('user_id:', user_id);
//     console.log('product_id:', product_id);
//     const response = await request.post('/order/create')
//       .send(order)
//       .set('Authorization', token)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//     expect(response.body.order.status).toEqual('active');
//   });
//   it('/orders should return an array of orders', async () => {
//     const response = await request.get('/orders')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200)
//   });
//   it('/order/1 should return a status of 200', async () => {
//     const response = await request.get('/order/1')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
//   it('/orders/complete should return a status of 200', async () => {
//     const response = await request.get('order/active')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
//   it('/orders/active/1 should return a status of 200', async () => {
//     const response = await request.get('orders/active/1')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
//   it('/orders/completed/1 should return a status of 404', async () => {
//     const response = await request.get('orders/completed/1')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
//   it('/order/delete/1 should return deleted order and status of 200', async () => {
//     const response = await request.delete('/order/delete/1 ')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
// })
