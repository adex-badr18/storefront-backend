"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../models/order");
const orders = new order_1.OrderStore();
// -------Beginning of handler functions
const getAllOrders = async (_req, res) => {
    try {
        const products = await orders.getAllOrders();
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
const getOrderById = async (req, res) => {
    const product = await orders.getOrderById(req.params.id);
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
const getOrdersByStatus = async (req, res) => {
    const product = await orders.getOrdersByStatus(req.params.status);
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
const createOrder = async (req, res) => {
    try {
        const order = {
            id: req.body.id,
            product_id: req.body.product_id,
            quantity: req.body.quantity,
            user_id: req.body.user_id,
            status: req.body.status
        };
        const neworder = orders.createOrder(order);
        res.json(neworder);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const deleteOrder = async (req, res) => {
    try {
        const deleted = await orders.deleteOrder(req.params.id);
        res.json(deleted);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// UPDATE ROUTE
const updateOrder = async (req, res) => {
    const order = {
        id: req.body.id,
        product_id: req.body.product_id,
        quantity: req.body.quantity,
        user_id: req.body.user_id,
        status: req.body.status
    };
    const updated = await orders.updateOrder(order);
    res.json(updated);
    try {
        res.send('this is the EDIT route');
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
// ------End of handler functions
// ------Express routes start
const order_routes = (app) => {
    app.get('/orders', getAllOrders);
    app.get('/order/:id', getOrderById);
    app.get('/orders/:category', getOrdersByStatus);
    app.post('/order/create', createOrder);
    app.delete('/order/delete/:id', deleteOrder);
    app.put('/order/update/:id', updateOrder);
};
// ------Express routes end
exports.default = order_routes;
