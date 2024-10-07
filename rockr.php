<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Check if the request method is POST
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get user input from the form
    $user = $_POST['username'] ?? '';
    $pass = password_hash($_POST['password'] ?? '', PASSWORD_BCRYPT); // Hash the password
    $email = $_POST['email'] ?? '';
    $phone = $_POST['phone'] ?? '';

    // Database credentials
    $servername = "localhost";
    $username = "root"; // Change this if your MySQL root user has a password
    $password = "Zlatanibra100."; // Enter your MySQL root password if you set one
    $dbname = "user_info"; // Make sure this database exists

    // Create connection
    $mysqli = new mysqli($servername, $username, $password, $dbname);

    // Check for connection error
    if ($mysqli->connect_error) {
        die("Connection failed: " . $mysqli->connect_error);
    }

    // Prepare and bind
    $stmt = $mysqli->prepare("INSERT INTO users (username, password, email, phone) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $user, $pass, $email, $phone);

    // Execute the statement and check for success
    if ($stmt->execute()) {
        echo "New record created successfully";
    } else {
        echo "Error: " . $stmt->error;
    }

    // Close connections
    $stmt->close();
    $mysqli->close();
} else {
    echo "Invalid request method.";
}
?>
