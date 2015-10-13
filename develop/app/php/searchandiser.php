<?php

$query = (isset($_POST['query']) && $_POST['query']) ? ',"query"' . ': ' . '"'.$_POST['query'].'"' : "";

$skip = (isset($_POST['skip']) && (int)$_POST['skip'] > 0) ? (int)$_POST['skip'] : 0;
$pageSize = (isset($_POST['pageSize']) && (int)$_POST['pageSize'] > 0) ? (int)$_POST['pageSize'] : 12;

$data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","area":"Production"' . $query . ',"fields":["*"], "skip":' . $skip . ',"pageSize":' . $pageSize . '}';
//$data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","area":"Production","fields":["*"],"skip":0,"pageSize":12}';
$url = "https://wwnorton.groupbycloud.com/api/v1/search?pretty";

$h=curl_init();
curl_setopt($h, CURLOPT_POST, true);
curl_setopt($h, CURLOPT_POSTFIELDS, $data);
curl_setopt($h, CURLOPT_RETURNTRANSFER, true);
curl_setopt($h, CURLOPT_URL, $url);

$result = curl_exec($h);
curl_close($h);

header ('Content-Type: text/javascript');
echo $result;
