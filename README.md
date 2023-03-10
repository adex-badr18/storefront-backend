# STOREFRONT BACKEND API

## Introduction

This is a REST API simulating an e-commerce backend based on three models: Products, Orders and Users. A detailed list of the endpoints and actions available can be found in the [REQUIREMENTS.md](https://github.com/adex-badr18/storefront-backend/blob/a64b4dcd070db6ca66e526d193fe66a9db18dd4a/REQUIREMENTS.md) file.

---

## APPLICATION SETUP PROCEDURE

### Database config

The API connects to a **postgres** database.
Please create **two** separate databases, one for the development environment and the testing environment. In a terminal tab, create and run the database:

- switch to the postgres user and start psql prompt: `sudo -u postgres psql`
- in psql prompt, run the following:
    - `CREATE USER shopping_user WITH PASSWORD 'password123';`
    - `CREATE DATABASE shopping;`
    - `CREATE DATABASE shopping_test;`
    - `\c shopping`
    - `GRANT ALL PRIVILEGES ON DATABASE shopping TO shopping_user;`
    - `\c shopping_test`
    - `GRANT ALL PRIVILEGES ON DATABASE shopping_test TO shopping_user;`


To make sure the API can connect to the db it is necessary to create a `database.json` file with the format below:

```json
{
    "dev": {
        "driver": "pg",
        "host": {
            "ENV": "PG_HOST"
        },
        "database": {
            "ENV": "PG_DB"
        },
        "user": {
            "ENV": "PG_USER"
        },
        "password": {
            "ENV": "PG_PASSWORD"
        }
    },
    "test": {
        "driver": "pg",
        "host": {
            "ENV": "PG_HOST"
        },
        "database": {
            "ENV": "PG_TEST_DB"
        },
        "user": {
            "ENV": "PG_USER"
        },
        "password": {
            "ENV": "PG_PASSWORD"
        }
    }
}
```

### Environment variables

The API relies on several environment variables to function.
**dotenv** is included in the **package.json** file.
Please create a **.env** file and declare the following variables in it:

| Name              |      Value       |                                                                       Notes                                                                       |
| ----------------- | :--------------: | :-----------------------------------------------------------------------------------------------------------------------------------------------: |
| PG_HOST     |    127.0.0.1     |                                                      Same value as in the database.json file                                                      |
| PG_DB       |    shopping    |                                                      Same value as in the database.json file                                                      |
| PG_TEST_DB  | shopping_test  |                                                      Same value as in the database.json file                                                      |
| PG_USER     | shop_user  |                                                      Same value as in the database.json file                                                      |
| PG_PASSWORD |  YOUR_PASSWORD   |                                                      Same value as in the database.json file                                                      |
| ENV               |       dev        |                           Used to set the DB environment. The test script automatically sets it to 'test' when running.                           |
| PORT              |    YOUR_PORT     |         The API will run on http://localhost.3000 by default, but there is the option to select a custom port as an environment variable          |
| SALT_ROUNDS       |        10        |                              Number of salt rounds the password hashing function of the bcrypt package will be using                              |
| BCRYPT_PASSWORD            | YOUR_STRING_HERE |                   A string of your choice that bcrypt will be adding prior to hashing passwords for an extra layer of security                    |
| ACCESS_TOKEN_SECRET      | YOUR_STRING_HERE | A string that will be used by jwt to generate authentication tokens. The more complex the better, it should be made of random characters ideally. |

---

### Prepare application

- `npm install` to install all dependencies
- `db-migrate up` to set up the database and get access via http://127.0.0.1:5432
- `npm run build` to build the app

### Start the app

- `npm run dev` to start the app and get access via http://127.0.0.1:3000 | http://localhost/:3000

> ### Scripts
>
> **npm run Script_key**
>
> | Script_keys         |                                                                                                 Description                                                                                                  |
> | -------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
> | prettier            |                                                                                              Prettify the code                                                                                             |
> | lint                |                                                                                                Parse the code                                                                                                |
> | jasmine-test        |                                                                                         Run unit tests using Jasmine                                                                                      |
> | build               |                                                                                                Build the app                                                                                                 |
> | dev               |                                                                                                Start the app                                                                                                 |
> | test                |                                      Execute DB migrations in testing environment, run tests using Jasmine, and finally drop all alterations in testing environment DB.                                    |
> | migrate             |                                                                                 execute DB migrations in testing environment                                                                             |

## How to use

The API provides both CRUD and custom actions for accessing and manipulating data in the database. You can find information regarding the requirements for sending requests to endpoints, data shapes, and database schema in the [REQUIREMENTS.md](https://github.com/adex-badr18/storefront-backend/blob/a64b4dcd070db6ca66e526d193fe66a9db18dd4a/REQUIREMENTS.md) file.




### ============================================================================================

# Storefront Backend Project

## Getting Started

This repo contains a basic Node and Express app to get you started in constructing an API. To get started, clone this repo and run `yarn` in your terminal at the project root.

## Required Technologies
Your application must make use of the following libraries:
- Postgres for the database
- Node/Express for the application logic
- dotenv from npm for managing environment variables
- db-migrate from npm for migrations
- jsonwebtoken from npm for working with JWTs
- jasmine from npm for testing

## Steps to Completion

### 1. Plan to Meet Requirements

In this repo there is a `REQUIREMENTS.md` document which outlines what this API needs to supply for the frontend, as well as the agreed upon data shapes to be passed between front and backend. This is much like a document you might come across in real life when building or extending an API. 

Your first task is to read the requirements and update the document with the following:
- Determine the RESTful route for each endpoint listed. Add the RESTful route and HTTP verb to the document so that the frontend developer can begin to build their fetch requests.    
**Example**: A SHOW route: 'blogs/:id' [GET] 

- Design the Postgres database tables based off the data shape requirements. Add to the requirements document the database tables and columns being sure to mark foreign keys.   
**Example**: You can format this however you like but these types of information should be provided
Table: Books (id:varchar, title:varchar, author:varchar, published_year:varchar, publisher_id:string[foreign key to publishers table], pages:number)

**NOTE** It is important to remember that there might not be a one to one ratio between data shapes and database tables. Data shapes only outline the structure of objects being passed between frontend and API, the database may need multiple tables to store a single shape. 

### 2.  DB Creation and Migrations

Now that you have the structure of the databse outlined, it is time to create the database and migrations. Add the npm packages dotenv and db-migrate that we used in the course and setup your Postgres database. If you get stuck, you can always revisit the database lesson for a reminder. 

You must also ensure that any sensitive information is hashed with bcrypt. If any passwords are found in plain text in your application it will not pass.

### 3. Models

Create the models for each database table. The methods in each model should map to the endpoints in `REQUIREMENTS.md`. Remember that these models should all have test suites and mocks.

### 4. Express Handlers

Set up the Express handlers to route incoming requests to the correct model method. Make sure that the endpoints you create match up with the enpoints listed in `REQUIREMENTS.md`. Endpoints must have tests and be CORS enabled. 

### 5. JWTs

Add JWT functionality as shown in the course. Make sure that JWTs are required for the routes listed in `REQUIUREMENTS.md`.

### 6. QA and `README.md`

Before submitting, make sure that your project is complete with a `README.md`. Your `README.md` must include instructions for setting up and running your project including how you setup, run, and connect to your database. 

Before submitting your project, spin it up and test each endpoint. If each one responds with data that matches the data shapes from the `REQUIREMENTS.md`, it is ready for submission!
