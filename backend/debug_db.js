const mysql = require('mysql2/promise');
require('dotenv').config();

console.log('--- Database Debug Script ---');
console.log('Environment Variables Check:');
console.log('DB_HOST:', process.env.DB_HOST ? 'Defined (' + process.env.DB_HOST + ')' : 'Undefined');
console.log('DB_USER:', process.env.DB_USER ? 'Defined (' + process.env.DB_USER + ')' : 'Undefined');
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? 'Defined (***)' : 'Undefined');
console.log('DB_NAME:', process.env.DB_NAME ? 'Defined (' + process.env.DB_NAME + ')' : 'Undefined');
console.log('DB_PORT:', process.env.DB_PORT ? 'Defined (' + process.env.DB_PORT + ')' : 'Undefined');

async function testConnection() {
    console.log('\nAttempting to connect to database...');
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT
        });
        console.log('✅ Connection successful!');

        console.log('Checking for tables...');
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables found:', rows.length);
        rows.forEach(row => {
            console.log('-', Object.values(row)[0]);
        });

        console.log('\nChecking users table...');
        const [users] = await connection.execute('SELECT username, role FROM users');
        console.log('Users found:', users.length);
        users.forEach(u => console.log(`- ${u.username} (${u.role})`));

        await connection.end();
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        if (error.code) console.error('Error Code:', error.code);
    }
}

testConnection();
