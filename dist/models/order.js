"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderStore = void 0;
const database_1 = __importDefault(require("../database"));
var OrderStatus;
(function (OrderStatus) {
    OrderStatus["active"] = "active";
    OrderStatus["complete"] = "complete";
})(OrderStatus || (OrderStatus = {}));
class OrderStore {
    async getAllOrders() {
        // a method that returns a list of all items in the database.
        try {
            const conn = await database_1.default.connect(); // connect to the database
            const sql = 'SELECT * FROM orders'; // write the sql query
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
            const sql = 'SELECT * FROM orders WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find order with id ${id}. Error: ${err}`);
        }
    }
    async getOrdersByStatus(status) {
        try {
            const sql = 'SELECT * FROM orders WHERE status=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [status]);
            const products = result.rows;
            conn.release();
            return products;
        }
        catch (err) {
            throw new Error(`Could not find items with status ${status}. Error: ${err}`);
        }
    }
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
    async updateOrder(o) {
        try {
            const connection = await database_1.default.connect();
            const sql = "UPDATE products SET product_id=$1, quantity=$2, user_id=$3, status='$4') WHERE id=$5";
            const result = await connection.query(sql, [
                o.product_id,
                o.quantity,
                o.user_id,
                o.status,
                o.id,
            ]);
            const product = result.rows[0];
            connection.release();
            return product;
        }
        catch (error) {
            throw new Error('An error occur while updating product:' + error);
        }
    }
    async deleteOrder(id) {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            const order = result.rows[0];
            conn.release();
            return order;
        }
        catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`);
        }
    }
}
exports.OrderStore = OrderStore;
