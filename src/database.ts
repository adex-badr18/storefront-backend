import * as dotenv from 'dotenv';
import { Pool } from 'pg';

dotenv.config();

const { PG_HOST, PG_DB, PG_TEST_DB, PG_USER, PG_PASSWORD, ENV } = process.env; // process.env is the content of the .env file

let client: Pool;

if (ENV === 'test') {
  client = new Pool({
    host: PG_HOST,
    database: PG_TEST_DB,
    user: PG_USER,
    password: PG_PASSWORD
  });
}

if (ENV === 'dev') {
  client = new Pool({
    host: PG_HOST,
    database: PG_DB,
    user: PG_USER,
    password: PG_PASSWORD
  });
}

client!.connect((err: Error) => {
  if (err) throw err;
  console.log('Connected');
  console.log(PG_PASSWORD);
});

export default client!;
