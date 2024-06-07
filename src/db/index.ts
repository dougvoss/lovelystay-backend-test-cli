import pgPromise from 'pg-promise';
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL ?? "http:localhost"

const pgp = pgPromise();
const db = pgp(databaseUrl);

export default db;