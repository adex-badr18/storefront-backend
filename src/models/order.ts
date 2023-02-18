import client from '../database';

export type OrderedProduct = {
  id: number | string;
  quantity: number;
  name?: string;
  price?: number | string;
  amount?: number;
};

export type OrderInit = {
  user_id: number;
  status: string;
}

export type Order = OrderInit & {
  products: OrderedProduct[]
};

export type OrderReturnedType = OrderInit & {
  id: number | string;
  products?: OrderedProduct[];
};

export type AllOrders = {
  id: number;
  product_id: number;
  user_id: number;
  product_name: string;
  price: number;
  category: string;
  quantity: number;
  status: string;
  amount: number;
}

export class OrderStore {
  async createOrder(order: Order): Promise<OrderReturnedType | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      // populate order table
      const createOrderQuery =
        'INSERT INTO orders (user_id, status) VALUES($1, $2) RETURNING *';
      const orderResult = await conn.query(createOrderQuery, [order.user_id, order.status]);

      // get id of newly created order
      const orderId: number = orderResult.rows[0].id;

      // populate order_products table with all ordered products by the user.
      const orderProductQuery = 'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';

      const products: OrderedProduct[] = [];

      for (const product of order.products) {
        const result = await conn.query(orderProductQuery, [orderId, product.id, product.quantity]);

        products.push({
          id: result.rows[0].product_id,
          quantity: result.rows[0].quantity
        });
      }
      conn.release();


      if (orderResult.rows.length === 0 || products.length === 0) return null;

      return {
        id: orderId,
        user_id: orderResult.rows[0].user_id,
        status: orderResult.rows[0].status,
        products: products,
      };
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async getAllOrders(): Promise<AllOrders[]> {
    // a method that returns a list of all items in the database.
    try {
      const conn = await client.connect(); // connect to the database
      const sql =
        'SELECT o.id order_id, op.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, op.quantity, o.status, (p.price * op.quantity) amount FROM products p JOIN order_products op ON p.id=op.product_id JOIN orders o ON op.order_id=o.id';
      const result = await conn.query(sql); // run the sql query on the database
      conn.release(); // close database connection
      return result.rows; // return the rows contained in the database query result
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async getOrderById(id: number): Promise<OrderReturnedType | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      const sql =
        'SELECT o.id order_id, op.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, op.quantity, o.status, (p.price * op.quantity) amount FROM products p JOIN order_products op ON p.id=op.product_id JOIN orders o ON op.order_id=o.id WHERE order_id=($1)';
      // const sql = 'SELECT * FROM orders WHERE id=($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      if (result.rows.length === 0) return null;

      const products: OrderedProduct[] = result.rows.map((product) => {
        return {
          id: product.product_id,
          name: product.product_name,
          quantity: product.quantity,
          price: product.product_price,
          amount: product.amount
        };
      });

      return {
        id,
        user_id: result.rows[0].user_id,
        status: result.rows[0].status,
        products
      };
    } catch (err) {
      throw new Error(`Could not find order with id ${id}. Error: ${err}`);
    }
  }

  async getOrdersByStatus(status: string): Promise<AllOrders[] | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      const sql =
        'SELECT o.id order_id, op.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, op.quantity, o.status, (p.price * op.quantity) amount FROM products p JOIN order_products op ON p.id=op.product_id JOIN orders o ON op.order_id=o.id WHERE o.status=($1)';
      const result = await conn.query(sql, [status]);
      conn.release();
      if (result.rows.length === 0) return null;
      return result.rows;
    } catch (err) {
      throw new Error(`Could not find order with status ${status}. Error: ${err}`);
    }
  }

  async deleteOrder(id: number): Promise<OrderReturnedType | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      // retrieve full info of the order to be deleted
      const toBeDeleted = await this.getOrderById(id);

      // Delete order
      const deleteOrderQuery = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      const deleteOrderResult = await conn.query(deleteOrderQuery, [id]);

      // Delete ordered_product
      const deleteOrderProductQuery = 'DELETE FROM order_products WHERE order_id=($1) RETURNING *';
      const deleteOrderProductResult = await conn.query(deleteOrderProductQuery, [id]);
      conn.release();

      if (deleteOrderResult.rows.length === 0 || deleteOrderProductResult.rows.length === 0) return null;

      return {
        id,
        user_id: deleteOrderResult.rows[0].user_id,
        status: deleteOrderResult.rows[0].status,
        products: toBeDeleted!.products
      };
    } catch (err) {
      throw new Error(`Could not delete order. Error: ${err}`);
    }
  }

  async userActiveOrders(user_id: number): Promise<OrderReturnedType[] | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      const sql =
        'SELECT o.id order_id, op.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, op.quantity, o.status, (p.price * op.quantity) amount FROM products p JOIN order_products op ON p.id=op.product_id JOIN orders o ON op.order_id=o.id WHERE o.status=($1) AND o.user_id=($2)';
      const result = await conn.query(sql, ['active', user_id]);
      conn.release();

      if (result.rows.length === 0) return null;
      // console.log(result.rows.length);
      // console.log(result.rows);

      let formattedOrders: OrderReturnedType[] =
        [
          {
            id: 0,
            user_id: 0,
            status: '',
            products: []
          }
        ];

      formattedOrders.pop(); // remove the initial item.
      for (const res of result.rows) {
        // const products: OrderedProduct[] = result.rows.map((product) => {
        //   return {
        //     id: product.product_id,
        //     name: product.product_name,
        //     quantity: product.quantity,
        //     price: product.product_price
        //   };
        // });
        formattedOrders.push({
          id: res.order_id,
          user_id: res.user_id,
          status: res.status,
          products: [
            {
              id: res.product_id,
              name: res.product_name,
              quantity: res.quantity,
              price: res.product_price,
              amount: res.amount
            }
          ]
        });

      }
      // console.log(formatted);
      return formattedOrders;
    } catch (err) {
      throw new Error(`Could not find order: ${err}.`);
    }
  }

  async userCompletedOrders(user_id: number): Promise<OrderReturnedType[] | null> {
    try {
      // @ts-ignore
      const conn = await client.connect();

      const sql =
        'SELECT o.id order_id, op.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, op.quantity, o.status, (p.price * op.quantity) amount FROM products p JOIN order_products op ON p.id=op.product_id JOIN orders o ON op.order_id=o.id WHERE o.status=($1) AND o.user_id=($2)';
      const result = await conn.query(sql, ['complete', user_id]);
      conn.release();

      if (result.rows.length === 0) return null;

      let formattedOrders: OrderReturnedType[] =
        [
          {
            id: 0,
            user_id: 0,
            status: '',
            products: []
          }
        ];

      formattedOrders.pop(); // remove the initial item.
      for (const res of result.rows) {
        // const products: OrderedProduct[] = result.rows.map((product) => {
        //   return {
        //     id: product.product_id,
        //     name: product.product_name,
        //     quantity: product.quantity,
        //     price: product.product_price
        //   };
        // });
        formattedOrders.push({
          id: res.order_id,
          user_id: res.user_id,
          status: res.status,
          products: [
            {
              id: res.product_id,
              name: res.product_name,
              quantity: res.quantity,
              price: res.product_price,
              amount: res.amount
            }
          ]
        });

      }
      // console.log(formatted);
      return formattedOrders;
    } catch (err) {
      throw new Error(`Could not find order: ${err}`);
    }
  }
}
