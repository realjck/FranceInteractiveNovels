<?php

$name = $_POST['name'];

$location_thumb = "../images/thumbs/".$name.".jpg";
$location_normal = "../images/".$name.".jpg";

unlink($location_thumb);
unlink($location_normal);
?>