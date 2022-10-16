import psql from 'pg'
import dotenv from 'dotenv'
dotenv.config();

const { Pool } = psql;

const connection = new Pool({
    user: 'postgres',
    password: process.env.PASSWORD_PG,
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE
})

export {connection};