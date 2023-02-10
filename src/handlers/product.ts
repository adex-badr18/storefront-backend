import express, { Request, Response } from 'express';
import { Product, ProductStore } from '../models/product';
import verifyAuthToken from '../middleware/verifyAuthToken';

const store = new ProductStore();

// -------Beginning of handler functions
const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await store.getAllProducts();
    if (!products) {
      return res.status(404).send('Found zero record.');
    }
    res.json(products);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await store.showProductById(+req.params.id);
    if (product === null) {
      return res.status(404).send('Found zero record.');
    }
    res.json(product);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const getProductByCategory = async (req: Request, res: Response) => {
  try {
    const product = await store.showProductByCategory(req.params.category);
    if (product === null) {
      return res.status(404).send('Found zero record.');
    }
    res.json(product);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createProduct = async (req: Request, res: Response) => {
  const product: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  };

  try {
    const newProduct = await store.create(product);
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteProduct = async (req: Request, res: Response) => {
  try {
    const deleted = await store.delete(+req.params.id);
    if (deleted === null) {
      return res
        .status(404)
        .json({ error: `No product with id ${req.params.id}` });
    }
    res.json(deleted);
  } catch (err) {
    res.status(400).json(err);
  }
};

// ------End of handler functions

// ------Express routes start
const product_routes = (app: express.Application) => {
  app.get('/products', getAllProducts);
  app.get('/product/:id', getProductById);
  app.get('/products/:category', getProductByCategory);
  app.post('/product/create', verifyAuthToken, createProduct);
  app.delete('/product/delete/:id', verifyAuthToken, deleteProduct);
};
// ------Express routes end

export default product_routes;
