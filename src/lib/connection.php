<?php 
$servername = 'localhost';
$username = 'username';
$password = 'password';

// Create connection
$conn = mysqli_connect($servername, $username, $password);

// Check connection
if (!$conn) {
	die("Failed to connect to database");
}  
?>
