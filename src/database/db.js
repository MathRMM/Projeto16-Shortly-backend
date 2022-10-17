import psql from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = psql;

const connection = new Pool({
    user: process.env.DB_USER,
    password: process.env.PASSWORD_PG,
    host: process.env.DATABASE_URL,
    port: process.env.DB_PORT,
    database: process.env.DATABASE,
});

export { connection };
