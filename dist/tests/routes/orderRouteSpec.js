"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const database_1 = __importDefault(require("../../database"));
const request = (0, supertest_1.default)(server_1.default);
let token;
describe('Order Handlers Test Suite', () => {
    beforeAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const deleteQuery = 'TRUNCATE orders, products, users RESTART IDENTITY';
            await conn.query(deleteQuery);
            conn.release();
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
    afterAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const deleteQuery = 'TRUNCATE orders, products, users RESTART IDENTITY';
            await conn.query(deleteQuery);
            conn.release();
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
    it('Create a user and product and authenticate the user', async () => {
        const user = {
            firstName: 'firstname',
            lastName: 'lastname',
            username: 'user1',
            password: 'password1'
        };
        const product = {
            name: 'Product1',
            price: 22000,
            category: 'Category'
        };
        // create a user
        const newUser = await request.post('/user/signup').send(user);
        console.log(newUser.body.user.username);
        // authenticate the new user to generate a token
        const res = await request.post('/user/login').send({ username: user.username, password: user.password });
        token = res.body.accessToken;
        // create a new product
        const newProduct = await request.post('/product/create').send(product).set('Authorization', `Bearer ${token}`);
        console.log(newProduct.body);
        expect(token).toBeTruthy();
        expect(res.status).toBe(200);
    });
    it('/order/create endpoint should return status of 201', async () => {
        const order = {
            product_id: 1,
            quantity: 3,
            user_id: 1,
            status: 'active'
        };
        const res = await request.post('/order/create').send(order)
            .set('Authorization', `Bearer ${token}`)
            .set('Content-Type', 'application/json');
        expect(res.status).toBe(201);
        expect(res.body.product_id).toEqual(1);
    });
    it('/order/1 endpoint returns a status of 200', async () => {
        const res = await request.get('/order/1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    it('/orders endpoint returns a list of order(s)', async () => {
        const res = await request.get('/orders')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body[0].user_id).toEqual(1);
    });
    it('/orders/complete endpoint returns a status of 404', async () => {
        const res = await request.get('/orders/complete')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
    it('/orders/completed/1 endpoint returns a status of 404', async () => {
        const res = await request.get('/orders/completed/1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
    it('/orders/active/1 endpoint returns a status of 200', async () => {
        const res = await request.get('/orders/active/1')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
    });
    it('/order/delete/3 endpoint returns a status of 200', async () => {
        const res = await request.delete('/order/delete/3')
            .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(404);
    });
});
