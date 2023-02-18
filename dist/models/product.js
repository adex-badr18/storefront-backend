"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductStore = void 0;
const database_1 = __importDefault(require("../database"));
class ProductStore {
    async getAllProducts() {
        // a method that returns a list of all items in the database.
        try {
            const conn = await database_1.default.connect(); // connect to the database
            const sql = 'SELECT * FROM products'; // write the sql query
            const result = await conn.query(sql); // run the sql query on the database
            conn.release(); // close database connection
            if (result.rows.length === 0)
                return null;
            return result.rows; // return the rows contained in the database query result
        }
        catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }
    }
    async showProductById(id) {
        try {
            const sql = 'SELECT * FROM products WHERE id=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            return result.rows[0];
        }
        catch (err) {
            throw new Error(`Could not find item with id ${id}. Error: ${err}`);
        }
    }
    async showProductByCategory(category) {
        try {
            const sql = 'SELECT * FROM products WHERE category=($1)';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [category]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            const products = result.rows;
            return products;
        }
        catch (err) {
            throw new Error(`Could not find items with category ${category}. Error: ${err}`);
        }
    }
    async create(p) {
        try {
            const sql = 'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
            // @ts-ignore
            const conn = await database_1.default.connect();
            const result = await conn.query(sql, [p.name, p.price, p.category]);
            const product = result.rows[0];
            conn.release();
            return product;
        }
        catch (err) {
            throw new Error(`Could not add new product "${p.name}". Error: ${err}`);
        }
    }
    async delete(id) {
        try {
            // @ts-ignore
            const conn = await database_1.default.connect();
            const sql = 'DELETE FROM products WHERE id=($1) RETURNING *';
            const result = await conn.query(sql, [id]);
            conn.release();
            if (result.rows.length === 0) {
                return null;
            }
            const product = result.rows[0];
            return product;
        }
        catch (err) {
            throw new Error(`Could not delete book ${id}. Error: ${err}`);
        }
    }
}
exports.ProductStore = ProductStore;
