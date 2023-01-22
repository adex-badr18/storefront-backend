import client from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category: string;
};

export class ProductStore {
  async getAllProducts(): Promise<Product[]> {
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

  async showProductById(id: string): Promise<Product> {
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

  async showProductByCategory(category: string): Promise<Product[]> {
    try {
      const sql = 'SELECT * FROM products WHERE category=($1)';
      // @ts-ignore
      const conn = await client.connect();

      const result = await conn.query(sql, [category]);
      const products = result.rows;
      conn.release();

      return products;
    } catch (err) {
      throw new Error(`Could not find items with category ${category}. Error: ${err}`);
    }
  }

  // async topFive(): Promise<Product[] | string> {
  //   try {
  //     const connection = await client.connect();

  //     const sql =
  //       'SELECT p.id, p.productname, sum(quantity) quantity ' +
  //       'FROM order_products op ' +
  //       'JOIN products p ON op.productid = p.id ' +
  //       'GROUP BY p.id ' +
  //       'ORDER BY sum(quantity) DESC LIMIT 5';

  //     const result = await connection.query(sql);
  //     connection.release();
  //     const products = result.rows;
  //     console.log(JSON.stringify(products));
  //     return products;
  //   } catch (error) {
  //     throw new Error(
  //       `Could not find products the most popular products. Error: ${error}`
  //     );
  //   }
  // }

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

  async update(p: Product): Promise<Product> {
    try {
      const connection = await client.connect();
      const sql =
        "UPDATE products SET name='$1', price=2$, category='$3') WHERE id= $4";
      const result = await connection.query(sql, [
        p.name,
        p.price,
        p.category,
        p.id,
      ]);
      const product = result.rows[0];
      connection.release();
      return product;
    } catch (error) {
      throw new Error('An error occur while updating product:' + error);
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
