"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouteSpec_1 = require("./userRouteSpec");
const database_1 = __importDefault(require("../../database"));
dotenv_1.default.config();
const request = (0, supertest_1.default)(server_1.default);
describe('Product Handlers Test Suite', () => {
    const product = {
        name: "Product1",
        price: 22000,
        category: "Product-Category"
    };
    beforeAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const query = 'TRUNCATE products, orders, users RESTART IDENTITY';
            const result = await conn.query(query);
            conn.release();
            //
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
    beforeEach(function () {
        const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it('/product/create endpoint should return status of 201', async () => {
        const res = await request.post('/product/create').send(product).set('Authorization', `Bearer ${userRouteSpec_1.token}`);
        const newProduct = res.body;
        expect(res.status).toBe(201);
        expect(res.body.name).toEqual('Product1');
    });
    it('/products/ProductCategory endpoint returns a status of 404', (done) => {
        const res = request.get('/products/ProductCategory')
            .then((res) => {
            expect(res.status).toBe(404);
            done();
        });
    });
    it('/products endpoint returns a list of product(s)', (done) => {
        const res = request.get('/products')
            .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body[0].category).toEqual('Product-Category');
            done();
        });
    });
    it('/product/1 endpoint returns a status of 200', (done) => {
        const res = request.get('/product/1')
            .then((res) => {
            expect(res.status).toBe(200);
            expect(res.body.id).toEqual(1);
            done();
        });
    });
    it('/product/delete/1 endpoint returns a status of 200', (done) => {
        const res = request.delete('/product/delete/1')
            .set('Authorization', `Bearer ${userRouteSpec_1.token}`)
            .then((res) => {
            expect(res.status).toBe(200);
            done();
        });
    });
});
