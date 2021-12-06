<?php
$entries = $_POST['entries'];
file_put_contents("../data/entries.json", $entries);
?>