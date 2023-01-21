import client from "../database";

enum OrderStatus {
    active = "active",
    complete = "complete",
}

export type Order = {
    id: number;
    product_id: number;
    quantity: number;
    user_id: number;
    status: OrderStatus
};

export class OrderStore {
    async index(): Promise<Order[]> { // a method that returns a list of all items in the database.
        try {
            const conn = await client.connect(); // connect to the database
            const sql = 'SELECT * FROM orders'; // write the sql query
            const result = await conn.query(sql); // run the sql query on the database
            conn.release(); // close database connection
            return result.rows; // return the rows contained in the database query result   
        } catch (error) {
            throw new Error(`Error fetching data: ${error}`);
        }

    }

    async show(id: string): Promise<Order> {
        try {
            const sql = 'SELECT * FROM orders WHERE id=($1)'
            // @ts-ignore
            const conn = await client.connect()

            const result = await conn.query(sql, [id])

            conn.release()

            return result.rows[0]
        } catch (err) {
            throw new Error(`Could not find order with id ${id}. Error: ${err}`)
        }
    }

    async create(o: Order): Promise<Order> {
        try {
            const sql =
                'INSERT INTO orders (product_id, quantity, user_id, status) VALUES($1, $2, $3) RETURNING *'
            // @ts-ignore
            const conn = await client.connect()

            const result = await conn
                .query(sql, [o.product_id, o.quantity, o.user_id, o.status])

            const order = result.rows[0]

            conn.release()

            return order
        } catch (err) {
            throw new Error(`Could not add new order. Error: ${err}`)
        }
    }

    async delete(id: string): Promise<Order> {
        try {
            const sql = 'DELETE FROM orders WHERE id=($1)'
            // @ts-ignore
            const conn = await client.connect()

            const result = await conn.query(sql, [id])

            const order = result.rows[0]

            conn.release()

            return order;
        } catch (err) {
            throw new Error(`Could not delete order. Error: ${err}`)
        }
    }
}