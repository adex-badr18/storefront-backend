# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints

#### API Root
`GET http://localhost:3000/api`

#### Products
- All products: `GET http://localhost:3000/products`
- Product by id (args: product id): `GET http://localhost:3000/product/1`
- Create product [token required]: `POST http://localhost:3000/product/create`
- [OPTIONAL] Products by category (args: product category): `GET http://localhost:3000/products/Product-Category`
- [OPTIONAL] Delete product (args: product id): `DELETE http://localhost:3000/product/delete/1`

#### Users
- All users [token required]: `GET http://localhost:3000/users`
- User by username (args: product id)[token required]: `GET http://localhost:3000/user/user1`
- Create user: `POST http://localhost:3000/user/signup`
- Authenticate user (args: username and password): `POST http://localhost:3000/user/login`
- Delete user (args: username) [token required]: `DELETE http://localhost:3000/user/delete/user2`

#### Orders
- All orders [token required]: `GET http://localhost:3000/orders`
- Order by id (args: order id) [token required]: `GET http://localhost:3000/order/1`
- Orders by status (args: order status) [token required]: `GET http://localhost:3000/orders/active`
- Create order [token required]: `POST http://localhost:3000/order/create`
- Delete order (args: order id) [token required]: `DELETE http://localhost:3000/order/delete/1`
- Current Order by user (args: user id)[token required]: `GET http://localhost:3000/orders/active/1`
- [OPTIONAL] Completed Orders by user (args: user id)[token required]: `GET http://localhost:3000/orders/completed/1`

## Data Shapes
### Product
-  id
- name
- price
- [OPTIONAL] category

```
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR (255) NOT NULL,
    price NUMERIC (9, 2) CHECK (price > 0) NOT NULL,
    category VARCHAR (100) NOT NULL
);
```

### User
- id
- firstName
- lastName
- username (UNIQUE)
- password

```
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR (100) NOT NULL,
    lastName VARCHAR (100) NOT NULL,
    username VARCHAR (255) UNIQUE NOT NULL,
    password VARCHAR (255) NOT NULL
);
```

#### Orders
- id
- product_id: id of each product in the order
- quantity: Quantity of each product in the order
- user_id
- status: Status of order (active or complete)

```
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    product_id INTEGER REFERENCES products(id) NOT NULL,
    quantity INTEGER NOT NULL,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    status VARCHAR(20) DEFAULT 'active'
);
```