<?php
// Database connection details
$host = 'localhost'; // or your database server
$db   = 'user_info';
$user = 'root';
$pass = 'Zlatanibra100.';
$charset = 'utf8mb4';

// Establish a connection to the database using PDO
$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    throw new \PDOException($e->getMessage(), (int)$e->getCode());
}

// Fetch data from the Chairs table
$stmt = $pdo->query('SELECT * FROM Chairs');
$chairs = $stmt->fetchAll();
?>
