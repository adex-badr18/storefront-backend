DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    price NUMERIC (9, 2) CHECK (price > 0) NOT NULL,
    category VARCHAR (100) NOT NULL
);