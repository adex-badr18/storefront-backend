import express, { NextFunction, Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';

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
    try {
        const product: Product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };

        const newProduct = store.create(product);
        res.json(newProduct);
    } catch (err) {
        res.status(400);
        res.json(err);
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

    const updated = await store.update(product)
    res.json(updated)
    try {
        res.send('this is the EDIT route')
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
    app.post('/product/create', createProduct);
    app.delete('/product/delete/:id', deleteProduct);
    app.put('/product/update/:id', updateProduct);
};
// ------Express routes end

export default product_routes;
