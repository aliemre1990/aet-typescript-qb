import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'sakila',
});

const res = await connection.query('SELECT * FROM customer, actor');

console.log(res);