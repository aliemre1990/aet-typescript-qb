import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '12345678',
    database: 'sakila',
});

const res = await connection.query('SELECT \'1\' as id, \'2\' as id');

console.log(res);