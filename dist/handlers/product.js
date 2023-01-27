"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
;
const store = new product_1.ProductStore();
// -------Beginning of handler functions
const getAllProducts = async (_req, res) => {
    try {
        const products = await store.getAllProducts();
        if (!products) {
            return res.send('Found zero record.');
        }
        res.json(products);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const getProductById = async (req, res) => {
    const product = await store.showProductById(req.params.id);
    try {
        if (product) {
            return res.json(product);
        }
        res.send('Found zero record.');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const getProductByCategory = async (req, res) => {
    const product = await store.showProductByCategory(req.params.category);
    try {
        if (product) {
            return res.json(product);
        }
        res.send('Found zero record.');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const createProduct = async (req, res) => {
    const product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    try {
        const newProduct = store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const deleteProduct = async (req, res) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// UPDATE ROUTE
const updateProduct = async (req, res) => {
    const product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };
    try {
        const updated = await store.update(product);
        res.json(updated);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// ------End of handler functions
// ------Express routes start
const product_routes = (app) => {
    app.get('/products', getAllProducts);
    app.get('/product/:id', getProductById);
    app.get('/products/:category', getProductByCategory);
    app.post('/product/create', verifyAuthToken_1.default, createProduct);
    app.delete('/product/delete/:id', verifyAuthToken_1.default, deleteProduct);
    app.put('/product/update/:id', verifyAuthToken_1.default, updateProduct);
};
// ------Express routes end
exports.default = product_routes;
