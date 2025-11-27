import dotenv from 'dotenv';
dotenv.config();

import mysql from 'mysql2';

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

connection.connect(err => {
  if (err) {
    console.error('Erreur de connexion :', err);
    return;
  }
  console.log('Connexion réussie à la base de données !');
});

