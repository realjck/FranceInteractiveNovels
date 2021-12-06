<?php

$filename = $_FILES['file']['name'];
$ext = pathinfo($filename, PATHINFO_EXTENSION);
$val = $_POST['val'];

$location_tmp = "../images/tmp/".$val.".".$ext;
$location_thumb = "../images/thumbs/".$val.".".$ext;
$location_normal = "../images/".$val.".".$ext;

if (move_uploaded_file($_FILES['file']['tmp_name'], $location_tmp) ) { 
	echo 'Success';
	resize_image($location_tmp, $location_thumb, 200, 200);
	resize_image($location_tmp, $location_normal, 1000, 1000);
	unlink($location_tmp);
} else { 
	echo 'Failure'; 
}


function resize_image($file, $destfile, $w, $h, $crop=FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height;
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }
	if (substr($file, -3) == "png"){
		$src = imagecreatefrompng($file);
	} else if (substr($file, -3) == "jpg"){
		$src = imagecreatefromjpeg($file);
	}
    $dst = imagecreatetruecolor($newwidth, $newheight);
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
	imagejpeg($dst, substr_replace($destfile , 'jpg', strrpos($destfile , '.') +1));
}
?>