<?php
$articles = file_get_contents("../json/details2.json");
$json_str = json_decode($articles, true);
$url_components = explode("/",$_SERVER["REQUEST_URI"]);
//$id = (isset($url_components[3]) && (int)$url_components[3] > 0) ? $url_components[3] : 1;
$id=1;

header('Content-Type: application/javascript');
$ctr = count($json_str);
for ($i=0; $i<$ctr; $i++) {
    if ($json_str[$i]['id'] == $id) {
        echo json_encode($json_str[$i]);
        die();
    }
}
