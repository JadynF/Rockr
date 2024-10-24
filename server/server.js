const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const path = require('path');

const app = express();

const TIMEOUT = 15; // in minutes
const loginQuery = require("./functions/loginQuery.js");
const createAcctQuery = require("./functions/createAcctQuery.js");
let userTokenMap = new Map(); // {username: [token, loginTime]}

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
  console.log("Attempting to auth");
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
      if (elapsedMinutes <= TIMEOUT) {
        return user;
      }
      else {
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
    return false;
  }
}


app.post('/getListing', async (req, res) => {
  console.log("user requesting listing");
  let body = req.body;
  const userToken = body.token;
  //const currListing = body.currListing;
  let username = isAuthorized(userToken);
  if (!username)
    return;

  let query = "SELECT id FROM User_information WHERE username = '" + username + "';";
  let userId = "";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userId = queryResponse[0][0].id;

  query = "SELECT prefPrice, prefColor, prefCondition FROM UserPreferences WHERE userId = " + userId + ";";
  let userPreferences = [];
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userPreferences = queryResponse[0][0];

  let prefPriceStr = "";
  let prefColorStr = "";
  let prefConditionStr = "";
  console.log(userPreferences.prefConditionStr);
  if (userPreferences.prefPrice)
    prefPriceStr = " AND L.chairPrice <= " + userPreferences.prefPrice;
  if (userPreferences.prefColor)
    prefColorStr = " AND L.chairColor = '" + userPreferences.prefColor + "'";
  if (userPreferences.prefConditionStr)
    prefConditionStr = " AND L.chairCondition = '" + userPreferences.prefCondition + "'";

  console.log(prefPriceStr);
  console.log(prefConditionStr);
  console.log(prefColorStr);

  // used to query database to get listing
  query = "SELECT listingId, imagePath, creatorId FROM (SELECT * FROM Listings WHERE listingId NOT IN (SELECT S.listingId FROM User_information U, Seen_listings S WHERE U.id = " + userId + " AND S.userId = U.id)) AS L, (SELECT id FROM User_information WHERE id = " + userId + ") AS U WHERE L.creatorId <> U.id" + prefPriceStr + prefColorStr + prefConditionStr + ";";
  //query = "SELECT listingId, imagePath, creatorId FROM Listings WHERE listingId NOT IN ( SELECT S.listingId FROM User_information U, Seen_listings S WHERE U.id = " + userId + " AND S.userId = U.id) LIMIT 1;";
  let listingId = ""
  let imagePath = ""
  let creatorId = ""
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  if (queryResponse[0].length == 0)
    return res.send(JSON.stringify({imagePath: "AllOut.jpeg", listingId: null}));
  listingId = queryResponse[0][0].listingId;
  imagePath = queryResponse[0][0].imagePath;
  creatorId = queryResponse[0][0].creatorId;

  query = "SELECT username FROM User_information WHERE id = " + creatorId + ";";
  let creatorUsername = "";
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  creatorUsername = queryResponse[0][0].username;

  query = "INSERT INTO Seen_listings (listingId, userId) VALUES (" + listingId + ", " + userId + ");";
  sendQuery(query);
  let responsePath = imagePath + ".jpeg";
  console.log("Sending listing");
  console.log("--------------------------------------");
  return res.send(JSON.stringify({imagePath: responsePath, listingId: listingId, creatorUsername: creatorUsername}));
});

app.post('/matchedListing', async (req) => {
  console.log("Attempting to push match");
  let body = req.body;
  const userToken = body.token;
  const currListing = body.currListing;
  let username = isAuthorized(userToken);
  if (!username) {
    return;
  }

  let query = "SELECT id FROM User_information WHERE username = '" + username + "';"
  let userId = "";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userId = queryResponse[0][0].id;
  
  query = "INSERT INTO MatchedWith (userId, listingId) VALUES (" + userId + ", " + currListing + ");";
  sendQuery(query);
  console.log("match sent");
});

app.post("/getChatOverviews", async (req, res) => {
  console.log("getting chat overviews");
  let body = req.body
  const userToken = body.token
  let username = isAuthorized(userToken);
  if (!username) 
    return;

  let query = "SELECT L.listingId, L.listingName, U.username FROM Listings L, User_information U WHERE (L.listingId in (SELECT listingId FROM MatchedWith WHERE userId = (SELECT id FROM User_information WHERE username = '" + username + "'))) AND (U.id = L.creatorId);";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  let outgoingChatListings = queryResponse[0];
  
  query = "SELECT L.listingId, L.listingName, U.username FROM Listings L, User_information U WHERE (L.creatorId = (SELECT id FROM User_information WHERE username = '" + username + "')) AND (U.id IN (SELECT userId FROM MatchedWith WHERE listingId = L.listingId));"
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  let incomingChatListings = queryResponse[0];
  let allChats = [outgoingChatListings, incomingChatListings];
  
  console.log("Sending chat overviews");
  return res.send(JSON.stringify(allChats));
})

app.post("/getIndividualChat", async (req, res) => {
  console.log("Getting individual chat information");
  let body = req.body
  let userToken = body.token;
  let listingId = body.listingId;
  let otherUser = body.userId;
  let username = isAuthorized(userToken);
  if (!username)
    return;

  let query = "SELECT id FROM User_information WHERE '" + username + "' = username;";
  let queryResponse = await sendQuery(query);
  if (!queryResponse)
    return;
  let myId = queryResponse[0][0].id;

  query = "SELECT id FROM User_information WHERE '" + otherUser + "' = username;";
  queryResponse = await sendQuery(query);
  if (!queryResponse)
    return;
  let otherId = queryResponse[0][0].id;

  query = "SELECT creatorId FROM Listings WHERE listingId = " + listingId + ";";
  queryResponse = await sendQuery(query);
  let actualCreator = queryResponse[0][0].creatorId;

  query = "SELECT * FROM MatchedWith WHERE userId = " + myId + " AND listingId = " + listingId + ";";
  queryResponse = await sendQuery(query);
  console.log(queryResponse[0][0]);
  console.log(actualCreator);
  console.log(otherUser);
  if (!queryResponse)
    return;
  else if (myId == actualCreator);
  else if (!queryResponse[0][0] || actualCreator != otherId) {
    console.log("not matched, going back");
    return res.send(JSON.stringify(""));
  }

  query = "SELECT listingName FROM Listings WHERE listingId = " + listingId + ";";
  queryResponse = await sendQuery(query);
  if (!queryResponse)
    return;
  let listingName = queryResponse[0][0].listingName;

  query = "SELECT text, timestamp, userId FROM Messages WHERE " + myId + " = userId AND " + otherId + " = receiverId AND listingId = " + listingId + " UNION SELECT text, timestamp, userId FROM Messages WHERE " + otherId + " = userId AND " + myId + " = receiverId AND listingId = " + listingId + " ORDER BY timestamp;";
  queryResponse = await sendQuery(query);
  if (!queryResponse)
    return;
  let messages = queryResponse[0];
  console.log("responding with individual chat");

  return res.send(JSON.stringify([myId, listingName, messages]));
})

app.post("/sendMessage", async (req, res) => {
  console.log('sending message');
  let body = req.body;
  let sendId = body.myId;
  let recvName = body.recvName;
  let listingId = body.listingId;
  let message = body.message;
  
  try {
    let query = "SELECT id FROM User_information WHERE username = '" + recvName + "';";
    queryResponse = await sendQuery(query);
    let recvId = queryResponse[0][0].id;

    query = "INSERT INTO Messages (`text`, userId, receiverId, listingId) VALUES ('" + message + "', " + sendId + ", " + recvId + ", " + listingId + ");";
    await sendQuery(query);
    console.log("sent message");
  }
  catch (error) {
    console.log("Query error");
  }
});

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });