"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
const order_1 = require("../../models/order");
const product_1 = require("../../models/product");
const user_1 = require("../../models/user");
const orderStore = new order_1.OrderStore();
const userStore = new user_1.Users();
const productStore = new product_1.ProductStore();
describe('Order model test suite', () => {
    beforeAll(async () => {
        const user = {
            firstName: 'UserOrder',
            lastName: 'UserOrder',
            username: 'userorder1',
            password: 'user123'
        };
        const product = {
            name: 'Hyundai Elantra 4 order1',
            price: 200000,
            category: 'Hyundai'
        };
        // const order: Order = {
        //   product_id: 1,
        //   quantity: 50000,
        //   user_id: 1,
        //   status: 'active'
        // };
        const order = {
            user_id: 1,
            status: "active",
            products: [
                {
                    id: 1,
                    quantity: 50000,
                    name: product.name,
                    price: product.price
                }
            ]
        };
        // delete existing records from all tables
        const conn = await database_1.default.connect();
        const query = 'TRUNCATE order_products, products, orders, users RESTART IDENTITY;';
        await conn.query(query);
        // create new user, new product and new order
        // create new product
        await productStore.create(product);
        // create new user
        await userStore.createUser(user);
        // create new order
        await orderStore.createOrder(order);
        conn.release();
    });
    afterAll(async () => {
        try {
            const conn = await database_1.default.connect();
            const query = 'TRUNCATE order_products, products, orders, users RESTART IDENTITY';
            await conn.query(query);
            conn.release();
        }
        catch (error) {
            throw new Error(`${error}`);
        }
    });
    it('getAllOrders() should not be empty', async () => {
        const orders = await orderStore.getAllOrders();
        expect(orders).not.toBeNull();
    });
    it('getOrderById() with wrong id should return null', async () => {
        const user = await orderStore.getOrderById(5000);
        expect(user).toBeNull();
    });
    it('getOrderByStatus() should be truthy', async () => {
        const orders = await orderStore.getOrdersByStatus('active');
        expect(orders).toBeTruthy();
    });
    it('createOrder() should return an object with user_id of 1', async () => {
        const product = {
            name: 'Peugeot 407',
            price: 30000,
            category: 'Peugeot'
        };
        // create new product
        await productStore.create(product);
        const order = {
            user_id: 1,
            status: "active",
            products: [
                {
                    id: 2,
                    quantity: 5,
                    name: product.name,
                    price: product.price
                }
            ]
        };
        const newOrder = await orderStore.createOrder(order);
        expect(newOrder.user_id).toEqual(1);
    });
    it('getUserActiveOrders(1) should return truthy value', async () => {
        const orders = await orderStore.userActiveOrders(1);
        expect(orders).toBeTruthy();
    });
    it('getUserCompletedOrders() with wrong user info should return null', async () => {
        const orders = await orderStore.userCompletedOrders(1000);
        expect(orders).toBeNull();
    });
    it('deleteOrder() with a wrong order id should return null', async () => {
        const deleted = await orderStore.deleteOrder(1000);
        expect(deleted).toBeNull();
    });
});
