const mysql = require('./backend/node_modules/mysql2/promise');
require('./backend/node_modules/dotenv').config({ path: './backend/.env' });


async function migrate() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    try {
        console.log('Adding scheduled_time column to orders table...');
        await connection.query('ALTER TABLE orders ADD COLUMN scheduled_time VARCHAR(20) NULL AFTER status');
        console.log('Migration successful!');
    } catch (error) {
        if (error.code === 'ER_DUP_COLUMN_NAME') {
            console.log('Column scheduled_time already exists.');
        } else {
            console.error('Migration failed:', error);
        }
    } finally {
        await connection.end();
    }
}

migrate();
