/* Replace with your SQL commands */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR (100),
    lastName VARCHAR (100),
    username VARCHAR (255) UNIQUE NOT NULL,
    password_hash VARCHAR (255) NOT NULL
);