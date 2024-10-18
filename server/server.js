const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

const app = express();

const TIMEOUT = 1; // in minutes
const loginQuery = require("./functions/loginQuery.js");
const createAcctQuery = require("./functions/createAcctQuery.js");
let userTokenMap = new Map(); // {username: [token, loginTime]}

const imagePaths = ['/chairImages/chair1.webp', '/chairImages/chair2.webp', '/chairImages/chair3.webp', '/chairImages/chair4.jpg', '/chairImages/chair5.webp'];

app.use(cors());
app.use(express.json());

// Create a MySQL connection pool
const pool = mysql.createPool({

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

//pool.query('SELECT * FROM User_information', (err, results, fields) => {
//  if (err) {
//    console.error('Error: ', err);
//  }
//  console.log(fields);
//});

// response contains "response", and if accepted "token"
app.post('/login', async (req, res) => {
  let body = req.body;

  // send query to see if user/password combo exists
  const query = "SELECT password FROM User_information WHERE username='" + body.username + "'";
  let realPassword = "";
  try {
    let queryResponse = await sendQuery(query);
    realPassword = queryResponse[0][0].password;
  }
  catch (error) {
    console.log(error);
  }

  if (realPassword == "" || body.password != realPassword)
    return res.send(JSON.stringify({response: "rejected"}));
  else if(body.password == realPassword){
    let responseToken = '';
    let hasToken = userTokenMap.has(body.username);

    if (hasToken && isAuthorized(userTokenMap.get(body.username)[0])) 
      responseToken = userTokenMap.get(body.username)[0];
    else {
      responseToken = jwt.sign({username: body.username}, "3f9c8fdeb68c4c9188f1e4c8a7bdb59e");
      const time = new Date();
      userTokenMap.set(body.username, [responseToken, time]);
    }

    return res.send(JSON.stringify({response: "accepted", token: responseToken}));
  }
});

// returns "response" and "user", "user" is false if not authorized
app.post('/isAuthorized', (req, res) => {
  const body = req.body;
  const currToken = body.token;
  let response = false;
  const user = isAuthorized(currToken);
  if (user) {
    response = true;
    console.log("Confirmed auth for: " + user);
  }
  else
    console.log("Auth for token failed");
  return res.send(JSON.stringify({response: response, user: user}));
});

// returns username if authorized, returns false if not
function isAuthorized(currToken) {
  for (const user of userTokenMap.keys()) {
    if (userTokenMap.get(user)[0] == currToken) {
      const currTime = new Date();
      const elapsedMinutes = Math.floor((currTime - userTokenMap.get(user)[1]) / 60000);
      if (elapsedMinutes <= TIMEOUT)
        return user;
      else {
        console.log(user + " timed out");
        userTokenMap.delete(user);
        return false;
      }
    }
  }
  return false;
}

app.post('/AcctCreation', (req, res) => {
    /*
    const body = req.body
    loginQuery = magicalMakeSQLQuery(body);
    connection.query(body.string, (error, results, fields) => {
      if (error) return res.send(error);
      return res.send(JSON.stringify(results));
    });
    */
    return res.send(JSON.stringify(req.body));
});

async function sendQuery(query) {
  try {
    const queryResponse = await pool.query(query);
    return queryResponse;
  }
  catch (error) {
    console.log(error);
  }
}


app.post('/getListing', async (req, res) => {
  let body = req.body;
  const userToken = body.token;
  const currListing = body.currListing;
  let username = isAuthorized(userToken);
  if (!username)
    return;
  console.log("User " + username + " requesting listing");

  try {
    // used to query database to get listing
    let query = "SELECT listingId, imagePath FROM Listings WHERE listingId NOT IN ( SELECT S.listingId FROM User_information U, Seen_listings S WHERE U.username = '" + username + "' AND S.userId = U.id) LIMIT 1;";
    let listingId = ""
    let imagePath = ""
    let queryResponse = await sendQuery(query);
    if (queryResponse[0].length == 0)
      return res.send(JSON.stringify({imagePath: "AllOut.jpeg", listingId: null}));
    listingId = queryResponse[0][0].listingId;
    imagePath = queryResponse[0][0].imagePath;

    query = "SELECT id FROM User_information WHERE username = '" + username + "';";
    let userId = "";
    queryResponse = await sendQuery(query);
    userId = queryResponse[0][0].id;
    query = "INSERT INTO Seen_listings VALUES ('" + listingId + "', " + userId + ");";
    sendQuery(query);

    let responsePath = imagePath + ".jpeg";
    return res.send(JSON.stringify({imagePath: responsePath, listingId: listingId}));
  } 
  catch (error) {
    console.log(error);
  }
});

app.post('/matchedListing', async (req, res) => {
  console.log("Attempting to push match");
  let body = req.body;
  const userToken = body.token;
  const currListing = body.currListing;
  let username = isAuthorized(userToken);
  if (!username)
    return;

  console.log("Sending query");
  try {
    let query = "SELECT id FROM User_information WHERE username = '" + username + "';"
    let userId = "";
    queryResponse = await sendQuery(query);
    userId = queryResponse[0][0].id;
    
    query = "INSERT INTO MatchedWith VALUES (" + userId + ", '" + currListing + "');";
    sendQuery(query);
  }
  catch (error) {
    console.log(error);
  }
});

//app.use(express.static(path.join(__dirname, 'build')));
//
//app.get('*', (req, res) => {
//  res.sendFile(path.join(__dirname, 'build', 'index.html'));
//});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });