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

async function createNewCustomer({ name, email, password }) {
    return await connection.query(`
        INSERT INTO customers (name, email, password)
        VALUES ($1, $2, $3);
    `, [name, email, password]);
}

async function selectCustomer(email) {
    return (await connection.query(`
        SELECT * 
        FROM customers
        WHERE email = $1
    `, [email])).rows;
}

async function createNewSession({ customerId, token, lastStatus }) {
    return (await connection.query(`
        INSERT INTO sessions (customer_id, token, last_status)
        VALUES ($1, $2, $3);
    `, [customerId, token, lastStatus])).rows;
}

async function selectSession(token) {
    return (await connection.query(`
        SELECT customers.email, customers.name, customers.id
        FROM customers
        JOIN sessions
            ON customers.id = sessions.customer_id
        WHERE token = $1;
    `, [token])).rows;
}

async function createNewUrl({ url, customerId, shortUrl }) {
    return (await connection.query(`
        INSERT INTO urls (customer_id, url, short_url)
        VALUES ($1, $2, $3);
    `, [customerId, url, shortUrl]));
}

async function selectUrlById(id) {
    return (await connection.query(`
        SELECT id, url, short_url
        FROM urls
        WHERE id = $1;
    `, [id])).rows;
}

async function selectCustomerByUrlId(id) {
    return (await connection.query(`
        SELECT customer_id AS id
        FROM urls
        WHERE urls.id = $1;
    `, [id])).rows;
}

async function selectUrlByShort(shortUrl) {
    const select = (await connection.query(` 
        SELECT url
        FROM urls
        WHERE short_url = $1;
    `, [shortUrl])).rows;
    if (!select[0]) return select
    await connection.query(`
    INSERT INTO url_hit_count (url_id)
    VALUES ((SELECT id
        FROM urls
        WHERE short_url = $1));
    `, [shortUrl])
    return select
}

async function deleteUrl(id){
    return await connection.query(`
        DELETE FROM urls
        WHERE id = $1;
    `,[id])
}

async function selectVisitsUrls(customerId){
    return (await connection.query(`
        SELECT 
            COUNT(url_hit_count.id) AS "visitCount",
            url_hit_count.url_id,
            urls.url,
            urls.short_url AS "shortUrl"
        FROM url_hit_count
        JOIN urls ON urls.id = url_hit_count.url_id
        WHERE urls.customer_id = $1
        GROUP BY 
            url_hit_count.url_id, 
            urls.url, 
            urls.short_url;
    `,[customerId])).rows;
}

async function selectRanking(){
    return (await connection.query(`
        SELECT 
            a.id,
            a.name,
            (SELECT COUNT(urls.id) 
            FROM urls 
            JOIN customers ON customers.id = urls.customer_id 
            WHERE urls.customer_id = a.id ) as "linksCount",
            COUNT(c.id) as "visitCount"
        FROM customers a
        LEFT JOIN urls u ON u.customer_id = a.id
        LEFT JOIN url_hit_count c ON c.url_id = u.id 
        GROUP BY 
            a.id,
            a.name
        ORDER BY "visitCount" DESC
        LIMIT 10;
    `)).rows;
}

export {
    createNewCustomer,
    selectCustomer,
    createNewSession,
    selectSession,
    createNewUrl,
    selectUrlById,
    selectUrlByShort,
    selectCustomerByUrlId,
    deleteUrl,
    selectVisitsUrls,
    selectRanking
}