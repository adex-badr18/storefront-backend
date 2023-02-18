import express, { Request, Response } from 'express';
import verifyAuthToken from '../middleware/verifyAuthToken';
import { Order, OrderedProduct, OrderReturnedType, AllOrders, OrderStore } from '../models/order';

const orders = new OrderStore();

// -------Beginning of handler functions
const getAllOrders = async (_req: Request, res: Response) => {
  try {
    const allOrders = await orders.getAllOrders();
    if (!allOrders) {
      return res.status(404).send('Found zero record.');
    }
    res.json(allOrders);
  } catch (err) {
    res.status(400);
    res.json(err);
  }
};

const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await orders.getOrderById(+req.params.id);
    if (order === null) {
      return res.status(404).send('Found zero record.');
    }
    res.json(order);
  } catch (err) {
    res.status(400).json(err);
  }
};

const getOrdersByStatus = async (req: Request, res: Response) => {
  const ordersByStatus = await orders.getOrdersByStatus(req.params.status);
  try {
    if (ordersByStatus === null) {
      return res.status(404).send('Found zero record.');
    }
    res.json(ordersByStatus);
  } catch (err) {
    res.status(400).json(err);
  }
};

const createOrder = async (req: Request, res: Response) => {
  try {
    const newOrder = await orders.createOrder({
      user_id: req.body.user_id,
      status: req.body.status,
      products: req.body.products
    });

    if (newOrder === null) return res.status(400).json('Something went wrong');

    res.status(201).json(newOrder);
  } catch (err) {
    res.status(400).json(err);
  }
};

const deleteOrder = async (req: Request, res: Response) => {
  const order_id = +req.params.id;
  try {
    const deleted = await orders.deleteOrder(order_id);
    if (deleted === null)
      return res
        .status(404)
        .json({ error: `Order with id ${order_id} does not exist` });
    res.json(deleted);
  } catch (err) {
    res.status(400).json(err);
  }
};

const userActiveOrders = async (req: Request, res: Response) => {
  try {
    const activeOrders = await orders.userActiveOrders(+req.params.user_id);
    if (activeOrders === null) {
      return res.status(404).json({
        message: `No active orders for user with id: ${req.params.user_id}`
      });
    }
    res.json(activeOrders);
  } catch (error) {
    res.status(400).json(error);
  }
};

const userCompletedOrders = async (req: Request, res: Response) => {
  try {
    const completedOrders = await orders.userCompletedOrders(
      +req.params.user_id
    );
    if (completedOrders === null) {
      return res.status(404).json({
        message: `No completed orders for user with id ${req.params.user_id}`
      });
    }
    res.status(200).json(completedOrders);
  } catch (error) {
    res.status(400).json(error);
  }
};

// ------End of handler functions

// ------Express routes start
const order_routes = (app: express.Application) => {
  app.get('/orders', verifyAuthToken, getAllOrders);
  app.get('/order/:id', verifyAuthToken, getOrderById);
  app.get('/orders/:status', verifyAuthToken, getOrdersByStatus);
  app.post('/order/create', verifyAuthToken, createOrder);
  app.delete('/order/delete/:id', verifyAuthToken, deleteOrder);
  app.get('/orders/active/:user_id', verifyAuthToken, userActiveOrders);
  app.get('/orders/completed/:user_id', verifyAuthToken, userCompletedOrders);
};
// ------Express routes end

export default order_routes;
