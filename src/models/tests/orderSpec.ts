import client from '../../database';
import { Order, OrderStore } from '../order';
import { Product, ProductStore } from '../product';
import { User, Users } from '../user';

const orderStore = new OrderStore();
const userStore = new Users();
const productStore = new ProductStore();

describe('Order model test suite', () => {
    beforeAll(async () => {
        // delete existing records from all tables
        const conn = await client.connect();
        const query = 'DELETE FROM orders; DELETE FROM products; DELETE FROM users; ALTER SEQUENCE orders_id_seq RESTART WITH 1; ALTER SEQUENCE products_id_seq RESTART WITH 1; ALTER SEQUENCE users_id_seq RESTART WITH 1;'
        await conn.query(query);

        // create new user, new product and new order
        const user: User = {
            "firstName": "UserOrder",
            "lastName": "UserOrder",
            "username": "userorder1",
            "password": "user123"
        };

        const product: Product = {
            name: "Hyundai Elantra 4 order1",
            price: 200000,
            category: "Hyundai"
        };
        const newProduct = await productStore.create(product);
        const newUser = await userStore.createUser(user);
        conn.release();
        const order: Order = {
            "product_id": 1,
            "quantity": 50000,
            "user_id": 1,
            "status": "active"
        };

        const newOrder = await orderStore.createOrder(order);
    });

    it('getAllOrders() should not be empty', async () => {
        const orders = await orderStore.getAllOrders();
        expect(orders).not.toBeNull();
    });

    it('getOrderById() should return null', async () => {
        const user = await orderStore.getOrderById(5000);
        expect(user).toBeNull();
    });

    it('getOrderByStatus() should be truthy', async () => {
        const orders = await orderStore.getOrdersByStatus('active');
        expect(orders).toBeTruthy();
    });

    it('createOrder() should return an object with user_id of 1', async () => {
        const order: Order = {
            "product_id": 1,
            "quantity": 3,
            "user_id": 1,
            "status": "active"
        };

        const newOrder = await orderStore.createOrder(order);
        expect(newOrder.user_id).toEqual(1);

    });

    it('getUserActiveOrders() with wrong user info should return null', async () => {
        const orders = await orderStore.userActiveOrders(1000);
        expect(orders).toBeNull();
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