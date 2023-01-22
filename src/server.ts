import express, { NextFunction, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Product, ProductStore } from './models/product';
import product_routes from './handlers/product';

const app: express.Application = express();
const address: string = '0.0.0.0:3000';

app.use(bodyParser.json());

app.get('/', (req: Request, res: Response) => {
  res.send('API of a Storefront Backend');
});

product_routes(app);

app.listen(3000, () => {
  console.log(`Running app on ${address}`);
});
