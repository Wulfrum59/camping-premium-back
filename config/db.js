import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();  // Charger les variables d'environnement


// Création d'un pool de connexions
export const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  connectionLimit: 10,
});
