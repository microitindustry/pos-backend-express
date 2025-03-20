const { Client } = require('pg');
require('dotenv').config();

// PostgreSQL connection configuration
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

async function getDatabaseSize() {
  try {
    await client.connect();
    // const res = await client.query("SELECT pg_database_size(current_database()) / 1024 / 1024 / 1024 AS size_gb;");
    // const res = await client.query("SELECT pg_database_size(current_database()) / 1024 AS size_kb;");
    const res = await client.query("SELECT pg_database_size(current_database()) / 1024 / 1024 AS size_mb;");


    // console.log(`Database size: ${res.rows[0].size_gb} GB`);
    // console.log(`Database size: ${res.rows[0].size_kb} KB`);
    console.log(`Database size: ${res.rows[0].size_mb} MB`);

  } catch (err) {
    console.error('Error fetching database size:', err);
  } finally {
    await client.end();
  }
}

getDatabaseSize();
