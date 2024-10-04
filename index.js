const express = require('express');
const app = express();
const PORT = process.env.PORT || 8000;

// Handle JSON data
app.use(express.json());

// Sample route
app.get('/', (req, res) => {
    res.send('Hello from Rockr!');
});

// Start the server
app.listen(PORT, () => {
    console.log('Server is running on port ${PORT}');
});