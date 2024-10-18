const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(express.json());

frontendPort = 3000;

//SQL DATABASE CONNECTION
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

//LISTENING FUNCTIONS
//Takes user's username and password input, finds user w/ the username and compares passwords. 
//If matching passwords, returns 'accepted' for user to be redirected to Home page
app.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  try {
    //Find user by username
    const [ sqlPass ] = await pool.promise().query('SELECT password, Verified FROM User_information WHERE username=?', [username]);
    //If user is found
    if(sqlPass.length = 1) {
      if(password == sqlPass[0].password && sqlPass[0].Verified == 1) {
        return res.send(JSON.stringify({response: "accepted"}));
      } else {
        return res.send(JSON.stringify({response: "rejected"}));
      }
    } else {
      return res.send(JSON.stringify({response: "userNotFound"}));
    }
  } catch (error) {
    res.status(500).send("Error fetching login information.");
  }
});

//Takes user input and registers user by putting information in database, with inputs, Verified=0, and a hex string verification token. User then checks their email and verfiies their account
app.post('/Register', async (req, res) => {
  const { firstName, lastName, username, password, email, phoneNumber } = req.body;
  const vToken = crypto.randomBytes(20).toString('hex')
  try {
    //Insert user's information into User_information table
    await pool.promise().query('INSERT INTO User_information (FirstName, LastName, username, password, email, phone, vToken) VALUES (?, ?, ?, ?, ?, ?, ?)', [firstName, lastName, username, password, email, phoneNumber, vToken]);
    //Establish email service & credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        //user
        //pass
      }
    });
    //Create email
    const mailOptions = {
      from: 'rockr.verify@gmail.com',
      to: email,
      subject: 'Email Verification',
      text: `Please verify your email by clicking this link:
      http://localhost:${frontendPort}/verify?token=${vToken}`
    };
    await transporter.sendMail(mailOptions);
    res.status(200).send('Verification email sent!');
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro registering user.');
  }
});

//Takes token, finds the user with that token, and verifies that user so they can log in.
app.get('/verify', async (req, res) => {
  const { token } = req.query;
  try {
    //Find user with the token
    const [rows] = await pool.promise().query('SELECT * FROM User_information WHERE vToken = ?', [token]);
    //If the user is not verified: true. If the user is verified / DNE, false.
    if(rows.length > 0){
      await pool.promise().query('UPDATE User_information SET Verified = 1, vToken = NULL WHERE vToken = ?', [token]);
      return res.send(JSON.stringify({response: 'Email verified successfully!'}));
    } else {
      return res.send(JSON.stringify({response: 'Invalid token.'}));
    }
  } catch (error) {
    res.status(500).send('Error verifying email.');
  }
});

app.listen(8000, () => {
    console.log(`Server is running on port 8000.`);
  });