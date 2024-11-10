const express = require('express');
const multer = require('multer');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise');
const path = require('path');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

const app = express();

// Set up multer to store files in a custom location with the correct extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'build/chairImages/');  // Specify your folder where images will be stored
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);  // Extract the file extension
    const filename = Date.now() + ext;  // Create a unique filename using current timestamp
    cb(null, filename);  // Save file with the new name and original extension
  }
});

const upload = multer({ storage });

const TIMEOUT = 15; // minutes
let userTokenMap = new Map(); // {username: [token, loginTime]}
const frontendPort = 3000; // used for verification

app.use(cors());
app.use(express.json());

// SQL DATABASE CONNECTION
// Create a MySQL connection pool
const pool = mysql.createPool({
  host: 'rockrdatabase-do-user-18048731-0.g.db.ondigitalocean.com',
  user: 'doadmin',
  password: 'AVNS_Qd4pwVZ6xO7LWrZRrRp',
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

// HELPER FUNCTIONS

// Returns username if authorized, returns false if not
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

//Sends promised SQL queries
async function sendQuery(query, list=[]) {
  try {
    const queryResponse = await pool.query(query, list);
    return queryResponse;
  }
  catch (error) {
    console.log(error);
    return false;
  }
}

//Creates a hash of a user's password using a salt
async function hashPassword(password) {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  const hashedPass = await bcrypt.hash(password, salt);
  // Do not need to return salt, as salt is part of the hashed password
  return hashedPass;
}

//LISTENING FUNCTIONS

//Takes user's submitted login input, finds username (if exists), compares password
//Successful: Redirect to home page, user is assigned Authorization token
//Failure: Returns message of unsuccessful login
app.post('/login', async (req, res) => {
  let inUsername = req.body.username;
  let inPassword = req.body.password;
  let body = req.body;

  // send query to see if user/password combo exists
  let realPassword = "";
  try {
    let queryResponse = await sendQuery('SELECT password, Verified FROM User_information WHERE username=?', [inUsername]);
    realPassword = queryResponse[0][0].password;
    userVerified = queryResponse[0][0].Verified;

    let passwordsMatched = await bcrypt.compare(inPassword, realPassword);
    console.log(inPassword);
    console.log(realPassword);
    console.log(passwordsMatched);
    if(!passwordsMatched) {
      return res.send(JSON.stringify({response: "Your password is incorrect."}));
    } else if(userVerified == 0) {
      return res.send(JSON.stringify({response: "Your email has not been verified. Please check your email."}));
    } else {
      let responseToken = '';
      let hasToken = userTokenMap.has(body.username);
      if (hasToken && isAuthorized(userTokenMap.get(body.username)[0])) 
        responseToken = userTokenMap.get(body.username)[0];
      else {
        //assign user a token
        responseToken = jwt.sign({username: body.username}, "3f9c8fdeb68c4c9188f1e4c8a7bdb59e");
        const time = new Date();
        userTokenMap.set(body.username, [responseToken, time]);
      }
      return res.send(JSON.stringify({response: "accepted", token: responseToken}));
    }
  }
  catch (error) {
    console.log(error);
    res.status(500).send(JSON.stringify({response: "Error fetching login information. Make sure your username is correct, or create an account."}));
  }
});

//Takes user input and registers user by putting information in database, with inputs, Verified=0, and a hex string verification token. User then checks their email and verfiies their account
app.post('/Register', async (req, res) => {
  const { firstName, lastName, username, password, email, phoneNumber } = req.body;
  const hashedPass = await hashPassword(password);
  const vToken = crypto.randomBytes(20).toString('hex')
  try {
    //Insert user's information into User_information table
    await sendQuery('INSERT INTO User_information (FirstName, LastName, username, password, email, phone, vToken) VALUES (?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, username, hashedPass, email, phoneNumber, vToken]);
    //Establish email service & credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rockr.verify@gmail.com',
        pass: 'xkttfbrqlnkakntq'
      }
    });
    //Create email
    const mailOptions = {
      from: 'rockr.verify@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking this link: http://localhost:8000/VerifyEmail?token=${vToken}`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).send(JSON.stringify({response: 'A verification email has been sent to your email.'}));
  } catch (error) {
    console.error(error);
    return res.status(500).send(JSON.stringify({response: 'Error registering user.'}));
  }
});

//Takes token, finds the user with that token, and verifies that user so they can log in.
app.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    //Find user with the token
    const [rows] = await sendQuery('SELECT * FROM User_information WHERE vToken = ?', [token]);
    //If the user is not verified: true. If the user is verified / DNE, false.
    if(rows.length > 0){
      await sendQuery('UPDATE User_information SET Verified = 1, vToken = NULL WHERE vToken = ?', [token]);
      return res.send(JSON.stringify({response: 'Email verified successfully!'}));
    } else {
      return res.send(JSON.stringify({response: 'Invalid token.'}));
    }
  } catch (error) {
    res.status(500).send('Error verifying email.');
  }
});

// Confirms Session Authorization
// True: Returns user and token
// False: User DNE
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

// Returns user information from User_information DB table
app.post('/getUser', async (req, res) => {
  //grab user via token
  const userT = req.body.token;
  const user = isAuthorized(userT);
  if(user) {
    let userInfo = await sendQuery('SELECT * FROM User_information WHERE username = ?', [user]);
    console.log(userInfo);
    let query = "SELECT * FROM UserPreferences WHERE userId = " + userInfo[0][0].id + ";";
    console.log(query);
    let response = await sendQuery(query);
    console.log(response[0][0]);
    console.log(userInfo[0][0]);
    return res.send(JSON.stringify([userInfo[0][0], response[0][0]]));
  } else {
    return res.send(JSON.stringify({error: "Failed to find user."}));
  }
});

//Pushes new user info to DB. Retrieves said info from DB and pushes to frontend (ensures consistency of data)
app.post('/newUserInfo', async (req, res) => {
  const body = req.body;
  const userT = body.token;
  const nFN = body.newfirstname, nLN = body.newlastname, nUN = body.newusername, nE = body.newemail, nPh = body.newphonenum;
  
  //grab user via token
  const user = isAuthorized(userT);
  time = new Date();
  userTokenMap.delete(user);
  userTokenMap.set(nUN, [userT, time]);
  if(user) {
    //try-catches are separate to return relevant error messages for each problem
    try {
      await sendQuery('UPDATE User_information SET username=?, email=?, phone=?, FirstName=?, LastName=? WHERE username=?', [nUN, nE, nPh, nFN, nLN, user]);
    } catch (error) {
      res.status(500).send(JSON.stringify({error: 'Error changing your info.'}));
    }
    try {
      let userInfo = await sendQuery('SELECT * FROM User_information WHERE username = ?', [nUN]);
      return res.send(userInfo[0][0]);
    } catch (error) {
      res.status(500).send(JSON.stringify({error: 'Error retrieving your new info.'}));
    }
  }
});

// sets new user preferences
app.post('/newPreferences', async (req, res) => {
  const body = req.body;
  const userToken = body.token;
  const username = isAuthorized(userToken);
  const newPrice = body.newPrice;
  let newColor = body.newColor;
  let newCondition = body.newCondition;

  let query = "SELECT id FROM User_information WHERE username = '" + username + "';";
  let userId = "";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userId = queryResponse[0][0].id;

  if (newColor != "NULL")
    newColor = `'${newColor}'`;

  if (newCondition != "NULL")
    newCondition = `'${newCondition}'`;

  query = "UPDATE UserPreferences SET prefCondition = " + newCondition + ", prefPrice = " + newPrice + ", prefColor = " + newColor + " WHERE userId = " + userId;
  console.log(query);
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return res.send(JSON.stringify({response: false}));
  }
  return res.send(JSON.stringify({response: true}));

});

app.post('/newUserPassword', async (req, res) => {
  const userToken = req.body.token;
  const inPassword = req.body.password;
  const user = isAuthorized(userToken);
  const newPass = await hashPassword(inPassword);
  if(user) {
    try{
      await sendQuery('UPDATE User_information SET password=? WHERE username=?', [newPass, user]);
      return res.status(200).send(JSON.stringify({response: 'Password changed successfully.'}));
    } catch (error) {
      return res.status(500).send(JSON.stringify({response: 'Error changing your password.'}));
    }
  } else {
    return res.status(500).send(JSON.stringify({response: 'Could not find your account.'}));
  }
});

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

  console.log(userPreferences);

  let prefPriceStr = "";
  let prefColorStr = "";
  let prefConditionStr = "";
  console.log(userPreferences.prefConditionStr);
  if (userPreferences.prefPrice)
    prefPriceStr = " AND L.chairPrice <= " + userPreferences.prefPrice;
  if (userPreferences.prefColor)
    prefColorStr = " AND L.chairColor = '" + userPreferences.prefColor + "'";
  if (userPreferences.prefCondition)
    prefConditionStr = " AND L.chairCondition = '" + userPreferences.prefCondition + "'";

  console.log(prefPriceStr);
  console.log(prefConditionStr);
  console.log(prefColorStr);

  // used to query database to get listing
  query = "SELECT listingId, imagePath, creatorId, listingName, chairCondition, chairPrice, chairColor FROM (SELECT * FROM Listings WHERE listingId NOT IN (SELECT S.listingId FROM User_information U, Seen_listings S WHERE U.id = " + userId + " AND S.userId = U.id)) AS L, (SELECT id FROM User_information WHERE id = " + userId + ") AS U WHERE L.creatorId <> U.id" + prefPriceStr + prefColorStr + prefConditionStr + ";";
  console.log(query);
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
  listingName = queryResponse[0][0].listingName;
  chairCondition = queryResponse[0][0].chairCondition;
  chairPrice = queryResponse[0][0].chairPrice;
  chairColor = queryResponse[0][0].chairColor;
  console.log(listingId, listingName, chairCondition, chairPrice, chairColor);

  query = "SELECT username FROM User_information WHERE id = " + creatorId + ";";
  let creatorUsername = "";
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  creatorUsername = queryResponse[0][0].username;

  query = "INSERT INTO Seen_listings (listingId, userId) VALUES (" + listingId + ", " + userId + ");";
  sendQuery(query);
  let responsePath = imagePath;
  console.log("Sending listing");
  console.log("--------------------------------------");
  return res.send(JSON.stringify({imagePath: responsePath, listingId: listingId, creatorUsername: creatorUsername, listingName: listingName, chairCondition: chairCondition, chairPrice: chairPrice, chairColor: chairColor}));
});

app.post('/getMyListings', async (req, res) => {
  let body = req.body;
  const username = isAuthorized(body.token);
  if (!username)
    return;

  let query = "SELECT id FROM User_information WHERE username = '" + username + "';"
  let userId = "";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userId = queryResponse[0][0].id;

  query = "SELECT * FROM Listings WHERE creatorId = " + userId + ";";
  queryResponse = await sendQuery(query);
  console.log(queryResponse[0]);
  console.log("My Listings");

  return res.send(JSON.stringify(queryResponse[0]));
})

app.post('/deleteListing', async (req, res) => {
  let body = req.body;
  let listingId = body.listingId;

  let query = "DELETE FROM MatchedWith WHERE listingId = " + listingId + ";";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }

  query = "DELETE FROM Messages WHERE listingId = " + listingId + ";";
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  
  query = "DELETE FROM Listings WHERE listingId = " + listingId + ";";
  queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }

  return res.send(JSON.stringify({response: true}));
})

app.post('/addListing', upload.single('image'), async (req, res) => {
  let body = req.body;
  let newImage = req.file;
  const username = isAuthorized(body.token);
  if (!username)
    return;

  let query = "SELECT id FROM User_information WHERE username = '" + username + "';"
  let userId = "";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  userId = queryResponse[0][0].id;

  let imagePath = "/chairImages/" + newImage.filename;
  let listingName = body.name;
  let listingCondition = body.condition;
  let listingPrice = body.price;
  let listingColor = body.color;
  
  let insertQuery = "INSERT INTO Listings (imagePath, listingName, chairCondition, chairPrice, chairColor, creatorId) VALUES ('" + imagePath + "', '" + listingName + "', '" + listingCondition + "', " + listingPrice + ", '" + listingColor + "', " + userId + ");";
  queryResponse = await sendQuery(insertQuery);
  if (!queryResponse)
    return;

  return res.send(JSON.stringify({response: true}));


})

app.post('/matchedListing', async (req, res) => {
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

  return res.send(JSON.stringify([true]));
});

app.post("/getChatOverviews", async (req, res) => {
  console.log("getting chat overviews");
  let body = req.body
  const userToken = body.token
  let username = isAuthorized(userToken);
  if (!username) 
    return;

  let query = "SELECT L.listingId, L.listingName, U.username, L.imagePath FROM Listings L, User_information U WHERE (L.listingId in (SELECT listingId FROM MatchedWith WHERE userId = (SELECT id FROM User_information WHERE username = '" + username + "'))) AND (U.id = L.creatorId);";
  let queryResponse = await sendQuery(query);
  if (!queryResponse) {
    return;
  }
  let outgoingChatListings = queryResponse[0];
  
  query = "SELECT L.listingId, L.listingName, U.username, L.imagePath FROM Listings L, User_information U WHERE (L.creatorId = (SELECT id FROM User_information WHERE username = '" + username + "')) AND (U.id IN (SELECT userId FROM MatchedWith WHERE listingId = L.listingId));"
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
  try {
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

    query = "SELECT listingName, imagePath, chairCondition, chairPrice, chairColor FROM Listings WHERE listingId = " + listingId + ";";
    queryResponse = await sendQuery(query);
    if (!queryResponse)
      return;
    let listingName = queryResponse[0][0].listingName;
    let imgPath = queryResponse[0][0].imagePath;
    let chrCondition = queryResponse[0][0].chairCondition;
    let chrPrice = queryResponse[0][0].chairPrice;
    let chrColor = queryResponse[0][0].chairColor;
    let creatorUser = "";
    if (myId == actualCreator) {
      creatorUser = username;
    }
    else {
      creatorUser = otherUser;
    }

    query = "SELECT text, timestamp, userId FROM Messages WHERE " + myId + " = userId AND " + otherId + " = receiverId AND listingId = " + listingId + " UNION SELECT text, timestamp, userId FROM Messages WHERE " + otherId + " = userId AND " + myId + " = receiverId AND listingId = " + listingId + " ORDER BY timestamp;";
    queryResponse = await sendQuery(query);
    if (!queryResponse)
      return;
    let messages = queryResponse[0];
    console.log("responding with individual chat");

    return res.send(JSON.stringify([myId, listingName, messages, imgPath, chrCondition, chrPrice, chrColor, creatorUser, username]));
  }
  catch (exception) {
    return res.send(JSON.stringify(""));
  }
});

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