"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
class OrderStore {
    async createOrder(o) {
        try {
            const sql = 'INSERT INTO orders (product_id, quantity, user_id, status) VALUES($1, $2, $3, $4) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [
                o.product_id,
                o.quantity,
                o.user_id,
                o.status
            ]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`);
        }
    }
    async getAllOrders() {
        // a method that returns a list of all items in the database.
        try {
            const conn = await database_1.default.connect(); // connect to the database
            const sql = 'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id'; // write the sql query
            const result = await conn.query(sql); // run the sql query on the database
            conn.release(); // close database connection
            return result.rows; // return the rows contained in the database query result
        }
        catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }
    async getOrderById(id) {
        try {
            const sql = 'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.user_id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            if (result.rows.length === 0)
                return null;
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order with id ${id}. Error: ${err}`);
        }
    }
    async getOrdersByStatus(status) {
        try {
            const sql = 'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [status]);
            if (result.rows.length === 0)
                return null;
            const orders = result.rows;
            conn.release();
            return orders;
        }
        catch (err) {
            throw new Error(`Could not fetch orders. Error: ${err}`);
        }
    }
    async deleteOrder(id) {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            if (result.rows.length === 0)
                return null;
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`);
        }
    }
    async userActiveOrders(user_id) {
        try {
            const connection = await database_1.default.connect();
            const sql = "SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status='active' AND o.user_id=($1) ORDER BY amount DESC";
            const result = await connection.query(sql, [user_id]);
            connection.release();
            if (result.rows.length === 0)
                return null;
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching active orders: ${error}`);
        }
    }
    async userCompletedOrders(user_id) {
        try {
            const connection = await database_1.default.connect();
            const sql = "SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status='complete' AND o.user_id=($1) ORDER BY amount DESC";
            const result = await connection.query(sql, [user_id]);
            connection.release();
            if (result.rows.length === 0)
                return null;
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error fetching completed orders: ${error}`);
        }
    }
}
exports.OrderStore = OrderStore;
