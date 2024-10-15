const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();
const path = require('path');

const TIMEOUT = 1; // in minutes
let userTokenMap = new Map(); // {username: [token, loginTime]}
const imagePaths = ['/chairImages/chair1.webp', '/chairImages/chair2.webp', '/chairImages/chair3.webp', '/chairImages/chair4.jpg', '/chairImages/chair5.webp'];

app.use(cors());
app.use(express.json());

// response contains "response", and if accepted "token"
app.post('/login', (req, res) => {
  let body = req.body;
  // send query to see if user/password combo exists
  if((body.username == "testuser" && body.password == "password") || (body.username == 'testuser2' && body.password == 'password2')){
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
  else{
    return res.send(JSON.stringify({response: "rejected"}));
  }
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
        userTokenMap.delete(user);
        return false;
      }
    }
  }
  return false;
}

// returns "response" and "user", "user" is false if not authorized
app.post('/isAuthorized', (req, res) => {
  const body = req.body;
  const currToken = body.token;
  let response = false;
  const user = isAuthorized(currToken);
  if (user)
    response = true;
  return res.send(JSON.stringify({response: response, user: user}));
})

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


app.post('/GetListing', (req, res) => {
  let body = req.body;

  // ideally, sends a query to database and returns path of image, with listing information
  // instead, this server keeps list of imagePaths and sends from those
  const imageIndex = body.imageIndex;
  let responsePath = imagePaths[imageIndex];
  return res.send(JSON.stringify({imagePath: responsePath}));
});

app.use('/static', express.static(__dirname + '/static'));

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });