import loginQuery from './functions/loginQuery';
import createAcctQuery from './functions/createAcctQuery';

const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

/*
//Establishes credentials to connect to MySQL database 
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'progDuck123*',
  database: 'screamin_oaks_database'
});
//Attempts connection to MySQL database
connection.connect((err) => {
  if (err) throw err;
  console.log('Connected!');
});
*/

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