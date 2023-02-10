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
// const request = supertest(app);
// type Token = {
//   accessToken: string
// }
// let token: Token = {
//   accessToken: ""
// };
// xdescribe("User Endpoints Test Suite", () => {
//   beforeAll(async () => {
//     // delete existing records from all tables
//     const conn = await client.connect();
//     const query = 'DELETE FROM users; ALTER SEQUENCE users_id_seq RESTART WITH 1;'
//     await conn.query(query);
//   });
//   it('/api endpoint to display brief information about the API.', async () => {
//     const response = await request.get('/api');
//     expect(response.status).toBe(200);
//   });
//   it('/user/signup should create a new user', async () => {
//     const user: User = {
//       firstName: "UserFirstname",
//       lastName: "UserLastname",
//       username: "user1",
//       password: "user123"
//     };
//     const response = await request.post('/user/signup')
//       .send(user)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//     expect(response.body.username).toEqual('user1');
//   });
//   it('/user/login should return a status of 200', async () => {
//     const user: User = {
//       id: 1,
//       firstName: "UserFirstname",
//       lastName: "UserLastname",
//       username: "user1",
//       password: "user123"
//     };
//     const response = await request.post('/user/login')
//       .expect((res) => {
//         token = jwtTokens(user);
//       })
//       .send({ username: user.username, password: user.password })
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//     expect(response).toBeTruthy();
//   });
//   it('/users should return an array of users', async () => {
//     const response = await request.get('/users')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200)
//     expect(response).toBeTruthy();
//   });
//   it('/user/user1 should return a status of 404', async () => {
//     const response = await request.get('/user/user1')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(404);
//   });
//   it('/user/delete/user1 should return deleted information about aliyu', async () => {
//     const response = await request.delete('/user/delete/user1')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
// })
// const productStore = new ProductStore();
// const userStore = new Users();
// const request = supertest(app);
// type Token = {
//   accessToken: string
// }
// let token: Token = {
//   accessToken: ""
// };
// describe("Product Endpoints Test Suite", () => {
//   beforeAll(async () => {
//     // delete existing records from all tables
//     const conn = await client.connect();
//     const query = 'DELETE FROM products; DELETE FROM users; ALTER SEQUENCE products_id_seq RESTART WITH 1; ALTER SEQUENCE users_id_seq RESTART WITH 1;'
//     await conn.query(query);
//     // create a new user
//     const user: User = {
//       firstName: "UserFirstname",
//       lastName: "UserLastname",
//       username: "user1",
//       password: "user123"
//     };
//     await userStore.createUser(user);
//     // generate token for the new user
//     token = jwtTokens(user);
//   });
//   it('/product/create should create a new product', async () => {
//     const product: Product = {
//       name: "Product1",
//       price: 22000,
//       category: "Product-Category"
//     };
//     const response = await request.post('/user/signup')
//       .send(product)
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//     expect(response.body.username).toEqual('user1');
//   });
//   it('/products should return an array of products', async () => {
//     const response = await request.get('/products')
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200)
//     expect(response).toBeTruthy();
//   });
//   it('/product/Product1 should return a status of 200', async () => {
//     const response = await request.get('/product/Product1')
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
//   it('/product/Product-Category should return a status of 200', async () => {
//     const response = await request.get('/product/Product-Category')
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//     expect(response).toBeTruthy();
//   });
//   it('/product/delete/1 should return deleted product and status of 200', async () => {
//     const response = await request.delete('/product/delete/1 ')
//       .set('Authorization', `Bearer ${token}`)
//       .set('Content-Type', 'application/json')
//     expect(response.status).toBe(200);
//   });
// })
