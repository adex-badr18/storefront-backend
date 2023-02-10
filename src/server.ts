import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import product_routes from './handlers/product';
import user_routes from './handlers/user';
import order_routes from './handlers/order';

dotenv.config();

const app: express.Application = express();
const address: string = '0.0.0.0:3000';
const corsOptions = { credential: true, origin: process.env.URL || '*' };

app.use(bodyParser.json());
app.use(cors(corsOptions));

app.get('/api', (req: Request, res: Response) => {
  res.send('API of a Storefront Backend');
});

product_routes(app);
user_routes(app);
order_routes(app);

app.listen(3000, () => {
  console.log(`Running app on ${address}`);
});


export default app;