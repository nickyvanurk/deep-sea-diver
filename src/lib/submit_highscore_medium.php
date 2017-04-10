<?php
$name = strip_tags(trim($_POST['name']));
$score = strip_tags(trim($_POST['score']));

if ($name && $score) {
	include('connection.php');
	mysqli_select_db($conn, 'dsd');

	$name = trim(preg_replace('/ +/', '', preg_replace('/[^A-Za-z0-9 ]/', '',
		urldecode(html_entity_decode(strip_tags($name))))));
	$score = trim(preg_replace('/ +/', '', preg_replace('/[^A-Za-z0-9 ]/', '',
		urldecode(html_entity_decode(strip_tags($score))))));

	$name = ucfirst(strtolower($name));


	$duperaw = mysqli_query($conn, "SELECT * FROM medium where (Name = '$name' AND Score = '$score')");

	// if there is no duplicate, score above 0, name not longer than 16 characters
	if (mysqli_num_rows($duperaw) === 0 && $score && strlen($name) <= 16) {
		$result = mysqli_query($conn, "INSERT INTO medium (Name, Score) VALUES ('$name', '$score')");
		if ($result) echo 'succes';
	}

	mysqli_close($conn);
}
?>