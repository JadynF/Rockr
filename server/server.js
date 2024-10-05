const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.post('/login', (req, res) => {
  let body = req.body;
  if(body.username == "testuser" && body.password == "password"){
    return res.send(JSON.stringify({response: "accepted"}));
  }
  else{
    return res.send(JSON.stringify({response: "rejected"}));
  }
});

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

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });