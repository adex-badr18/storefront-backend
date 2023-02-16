DROP TABLE IF EXISTS order_products;

CREATE TABLE order_products (
order_id INTEGER REFERENCES orders(id),
product_id INTEGER REFERENCES products(id),
quantity INTEGER NOT NULL
);