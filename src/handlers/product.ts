import express, { NextFunction, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import jwt from 'jsonwebtoken';
import verifyAuthToken from '../middleware/verifyAuthToken';;

const store = new ProductStore();

// -------Beginning of handler functions
const getAllProducts = async (_req: Request, res: Response) => {
    try {
        const products = await store.getAllProducts();
        if (!products) {
            return res.send('Found zero record.');
        }
        res.json(products);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getProductById = async (req: Request, res: Response) => {
    const product = await store.showProductById(req.params.id);
    try {
        if (product) {
            return res.json(product);
        }
        res.send('Found zero record.');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const getProductByCategory = async (req: Request, res: Response) => {
    const product = await store.showProductByCategory(req.params.category);
    try {
        if (product) {
            return res.json(product);
        }
        res.send('Found zero record.');
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

const createProduct = async (req: Request, res: Response) => {
    const product: Product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    };

    try {
        const newProduct = store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400).json(err);
    }
};

const deleteProduct = async (req: Request, res: Response) => {
    try {
        const deleted = await store.delete(req.params.id);
        res.json(deleted);
    } catch (err) {
        res.status(400);
        res.json(err);
    }
};

// UPDATE ROUTE
const updateProduct = async (req: Request, res: Response) => {
    const product: Product = {
        id: req.body.id,
        name: req.body.name,
        price: req.body.price,
        category: req.body.category
    }

    try {
        const updated = await store.update(product)
        res.json(updated)
    } catch (err) {
        res.status(400)
        res.json(err)
    }
}

// ------End of handler functions

// ------Express routes start
const product_routes = (app: express.Application) => {
    app.get('/products', getAllProducts);
    app.get('/product/:id', getProductById);
    app.get('/products/:category', getProductByCategory);
    app.post('/product/create', verifyAuthToken, createProduct);
    app.delete('/product/delete/:id', verifyAuthToken, deleteProduct);
    app.put('/product/update/:id', verifyAuthToken, updateProduct);
};
// ------Express routes end

export default product_routes;
