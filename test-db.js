require("dotenv").config();
const mysql = require("mysql2/promise");

console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function testConnection() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  try {
    await connection.connect();
    console.log("Successfully connected to MySQL database");
    // Test query
    const [rows] = await connection.execute("SELECT 1");
    console.log("Query executed successfully");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await connection.end();
  }
}

testConnection();
