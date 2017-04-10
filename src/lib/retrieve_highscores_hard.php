<?php
include('connection.php');
mysqli_select_db($conn, 'dsd');
$result=mysqli_query($conn, "SELECT * FROM hard ORDER BY Score DESC LIMIT 10");

echo "<table border='1' >";

$count = 0;
while($data = mysqli_fetch_row($result)) {   
	$count++;
	echo "<tr>";
	echo "<td align=center>$count.</td>";
	echo "<td align=center>$data[1]</td>";
	echo "<td align=center>$data[2]</td>";
	echo "</tr>";
}
echo "</table>";
mysqli_close($conn);
?>