import client from '../database';

export type OrderedProduct = {
  id: number | string;
  quantity: number;
  name?: string;
  price?: number | string;
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
        products: products,
        user_id: orderResult.rows[0].user_id,
        status: orderResult.rows[0].status
      };
    } catch (err) {
      throw new Error(`Could not add new order. Error: ${err}`);
    }
  }

  async getAllOrders(): Promise<Order[]> {
    // a method that returns a list of all items in the database.
    try {
      const conn = await client.connect(); // connect to the database
      const sql =
        'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id'; // write the sql query
      const result = await conn.query(sql); // run the sql query on the database
      conn.release(); // close database connection
      return result.rows; // return the rows contained in the database query result
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async getOrderById(id: number): Promise<Order | null> {
    try {
      const sql =
        'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.user_id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      if (result.rows.length === 0) return null;

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find order with id ${id}. Error: ${err}`);
    }
  }

  async getOrdersByStatus(status: string): Promise<Order[] | null> {
    try {
      const sql =
        'SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [status]);

      conn.release();

      if (result.rows.length === 0) return null;

      const orders = result.rows;

      return orders;
    } catch (err) {
      throw new Error(`Could not fetch orders. Error: ${err}`);
    }
  }

  async deleteOrder(id: number): Promise<Order | null> {
    try {
      const sql = 'DELETE FROM orders WHERE id=($1) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      if (result.rows.length === 0) return null;

      const order = result.rows[0];

      return order;
    } catch (err) {
      throw new Error(`Could not delete order. Error: ${err}`);
    }
  }

  async userActiveOrders(user_id: number): Promise<Order[] | null> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status='active' AND o.user_id=($1) ORDER BY amount DESC";
      const result = await conn.query(sql, [user_id]);

      conn.release();

      if (result.rows.length === 0) return null;

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching active orders: ${error}`);
    }
  }
  async userCompletedOrders(user_id: number): Promise<Order[] | null> {
    try {
      const conn = await client.connect();
      const sql =
        "SELECT o.id order_id, o.product_id, o.user_id, p.name product_name, p.price product_price, p.category product_category, o.quantity, o.status, (p.price * o.quantity) amount FROM products p JOIN orders o ON p.id=o.product_id JOIN users u ON u.id=o.user_id WHERE o.status='complete' AND o.user_id=($1) ORDER BY amount DESC";
      const result = await conn.query(sql, [user_id]);

      conn.release();

      if (result.rows.length === 0) return null;

      return result.rows;
    } catch (error) {
      throw new Error(`Error fetching completed orders: ${error}`);
    }
  }
}
