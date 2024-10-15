const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const mongoose = require('mongoose');
const dotenv = require('dotenv');


const loginQuery = require("./functions/loginQuery.js");
const createAcctQuery = require("./functions/createAcctQuery.js");

const app = express();

app.use(cors());
app.use(express.json());


// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'database-host',
  user: 'doadmin',
  database: 'defaultdb',
  port: 25060
});

// Test the database connection
pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
  connection.release();
});

pool.query('SELECT * FROM User_information', (err, results, fields) => {
  if (err) {
    console.error('Error: ', err);
  }
  console.log(fields);
});


app.post('/login', (req, res) => {
  let body = req.body;
  if(body.username == "testuser" && body.password == "password"){
    return res.send(JSON.stringify({response: "accepted"}));
  }
  else{
    return res.send(JSON.stringify({response: "rejected"}));
  }
  /*
    const body = req.body
    let loginQueryStr = loginQuery(body);
    connection.query(loginQueryStr, (error, results, fields) => {
      if (error) return res.send(error);
      if(results == body.password){
        return res.send(JSON.stringify({response: "accepted"}));
      } else {
        return res.send(JSON.stringify({response: "rejected"}));
      }
    });
  */
});

app.post('/AcctCreation', (req, res) => {
    return res.send(JSON.stringify(req.body));
    /*
    const body = req.body
    let createAcctStr = createAcctQuery(body);
    connection.query(createAcctStr, (error, results, fields) => {
      if (error){
        return res.send(JSON.stringify({reponse: "Unexpected error."}));
      } else {
        return res.send(JSON.stringify({response: "accepted"}));
      }
    });
    */
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });