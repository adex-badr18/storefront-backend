"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const product_1 = require("../models/product");
const store = new product_1.ProductStore();
// -------Beginning of handler functions
const index = async (_req, res) => {
    try {
        const products = await store.index();
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
const show = async (req, res) => {
    const product = await store.show(req.params.id);
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
const create = async (req, res) => {
    try {
        const product = {
            id: req.body.id,
            name: req.body.name,
            price: req.body.price,
            category: req.body.category
        };
        const newProduct = store.create(product);
        res.json(newProduct);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const delete_product = async (req, res) => {
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
// const update = async (req: Request, res: Response) => {
//     const weapon: Weapon = {
//         id: req.body.id,
//         name: req.body.name,
//         type: req.body.type,
//         weight: req.body.weight
//     }
//     try {
//         res.send('this is the EDIT route')
//     } catch (err) {
//         res.status(400)
//         res.json(err)
//     }
// }
// ------End of handler functions
// ------Express routes start
const product_routes = (app) => {
    app.get('/products', index);
    app.get('/products/:id', show);
    app.post('/products', create);
    app.delete('/products/:id', delete_product);
    // app.put('/weapons/:id', update);
};
// ------Express routes end
exports.default = product_routes;
