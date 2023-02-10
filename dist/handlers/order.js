"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const verifyAuthToken_1 = __importDefault(require("../middleware/verifyAuthToken"));
const order_1 = require("../models/order");
const orders = new order_1.OrderStore();
// -------Beginning of handler functions
const getAllOrders = async (_req, res) => {
    try {
        const allOrders = await orders.getAllOrders();
        if (!allOrders) {
            return res.send('Found zero record.');
        }
        res.json(allOrders);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const getOrderById = async (req, res) => {
    try {
        const order = await orders.getOrderById(+req.params.id);
        if (order === null) {
            return res.send('Found zero record.');
        }
        res.json(order);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const getOrdersByStatus = async (req, res) => {
    const ordersByStatus = await orders.getOrdersByStatus(req.params.status);
    try {
        if (ordersByStatus === null) {
            return res.status(404).send('Found zero record.');
        }
        res.json(ordersByStatus);
    }
    catch (err) {
        res.status(400);
        res.json(err);
    }
};
const createOrder = async (req, res) => {
    try {
        const order = {
            product_id: +req.body.product_id,
            quantity: +req.body.quantity,
            user_id: +req.body.user_id,
            status: req.body.status
        };
        const newOrder = await orders.createOrder(order);
        res.status(201).json(newOrder);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const deleteOrder = async (req, res) => {
    const order_id = +req.params.id;
    try {
        const deleted = await orders.deleteOrder(order_id);
        if (deleted === null)
            return res.status(404).json({ error: `Order with id ${order_id} does not exist` });
        res.json(deleted);
    }
    catch (err) {
        res.status(400).json(err);
    }
};
const userActiveOrders = async (req, res) => {
    try {
        const activeOrders = await orders.userActiveOrders(+req.params.user_id);
        if (activeOrders === null) {
            return res.status(404).json({ message: `No active orders for user with id: ${req.params.user_id}` });
        }
        res.json(activeOrders);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
const userCompletedOrders = async (req, res) => {
    try {
        const completedOrders = await orders.userCompletedOrders(+req.params.user_id);
        if (completedOrders === null) {
            return res.status(404).json({ message: `No completed orders for user with id ${req.params.user_id}` });
        }
        res.status(200).json(completedOrders);
    }
    catch (error) {
        res.status(400).json(error);
    }
};
// ------End of handler functions
// ------Express routes start
const order_routes = (app) => {
    app.get('/orders', verifyAuthToken_1.default, getAllOrders);
    app.get('/order/:id', verifyAuthToken_1.default, getOrderById);
    app.get('/orders/:status', verifyAuthToken_1.default, getOrdersByStatus);
    app.post('/order/create', verifyAuthToken_1.default, createOrder);
    app.delete('/order/delete/:id', verifyAuthToken_1.default, deleteOrder);
    app.get('/orders/active/:user_id', verifyAuthToken_1.default, userActiveOrders);
    app.get('/orders/completed/:user_id', verifyAuthToken_1.default, userCompletedOrders);
};
// ------Express routes end
exports.default = order_routes;
