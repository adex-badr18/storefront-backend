import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async index(): Promise<Product[]> {
    // a method that returns a list of all items in the database.
    try {
      const conn = await client.connect(); // connect to the database
      const sql = 'SELECT * FROM products'; // write the sql query
      const result = await conn.query(sql); // run the sql query on the database
      conn.release(); // close database connection
      return result.rows; // return the rows contained in the database query result
    } catch (error) {
      throw new Error(`Error fetching data: ${error}`);
    }
  }

  async show(id: string): Promise<Product> {
    try {
      const sql = 'SELECT * FROM products WHERE id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      conn.release();

      return result.rows[0];
    } catch (err) {
      throw new Error(`Could not find item with id ${id}. Error: ${err}`);
    }
  }

  async create(p: Product): Promise<Product> {
    try {
      const sql =
        'INSERT INTO products (name, price, category) VALUES($1, $2, $3) RETURNING *';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [p.name, p.price, p.category]);

      const weapon = result.rows[0];

      conn.release();

      return weapon;
    } catch (err) {
      throw new Error(`Could not add new book ${p.name}. Error: ${err}`);
    }
  }

  async delete(id: string): Promise<Product> {
    try {
      const sql = 'DELETE FROM products WHERE id=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [id]);

      const product = result.rows[0];

      conn.release();

      return product;
    } catch (err) {
      throw new Error(`Could not delete book ${id}. Error: ${err}`);
    }
  }
}
