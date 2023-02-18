"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../../models/product");
const database_1 = __importDefault(require("../../database"));
const store = new product_1.ProductStore();
describe('Product model test suite', () => {
    beforeAll(async () => {
        const product = {
            name: 'Hyundai Elantra',
            price: 220,
            category: 'Hyundai'
        };
        await store.create(product);
    });
    afterAll(async () => {
        const conn = await database_1.default.connect();
        const sql = 'DELETE FROM products WHERE name IN ($1, $2)';
        await conn.query(sql, ['Hyundai Elantra', 'Lexus G7']);
        conn.release();
    });
    it('getAllProducts() should not be empty', async () => {
        const products = await store.getAllProducts();
        expect(products).not.toBeNull();
    });
    it('showProductById(50) should return null', async () => {
        const product = await store.showProductById(5000);
        expect(product).toBeNull();
    });
    it('showProductByCategory() should be equal to categoriesArray', async () => {
        const categories = await store.showProductByCategory('Hyundai');
        expect(categories.length).toBeGreaterThan(0);
    });
    it('create() should return an object with price "55555"', async () => {
        const product = {
            name: 'Lexus G7',
            price: 55555,
            category: 'Lexus'
        };
        await store.create(product);
        const conn = await database_1.default.connect();
        const sql = 'SELECT * FROM products WHERE name=($1)';
        const result = await conn.query(sql, [product.name]);
        conn.release();
        expect(result.rows[0].price).toEqual('55555.00');
    });
    it('delete() should return a null value', async () => {
        const deleted = await store.delete(50000);
        expect(deleted).toBeNull();
    });
});
