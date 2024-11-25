// test-env.js
const dotenv = require("dotenv");
const result = dotenv.config();

console.log("Environment variables loaded:");
console.log({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_NAME,
});
