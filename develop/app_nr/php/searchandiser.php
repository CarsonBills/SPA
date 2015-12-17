<?php

if (!isset($_REQUEST['sort'])) {
    //var_dump($_REQUEST);exit;
}


$platform = "Prod";
$area = "Prod";

$query = (isset($_REQUEST['query']) && $_REQUEST['query']) ? ',"query"' . ': ' . '"'.$_REQUEST['query'].'"' : "";

$skip = (isset($_REQUEST['skip']) && (int)$_REQUEST['skip'] > 0) ? ',"skip":' . (int)$_REQUEST['skip'] : ',"skip": 0';
$sitecode = (isset($_REQUEST['sitecode']) && $_REQUEST['sitecode']) ? $_REQUEST['sitecode'] : "nortonreader";
$siteversion = (isset($_REQUEST['siteversion']) && $_REQUEST['siteversion']) ? $_REQUEST['siteversion'] : "full";
$pageSize = (isset($_REQUEST['pageSize']) && (int)$_REQUEST['pageSize'] > 0) ? ',"pageSize":' . (int)$_REQUEST['pageSize'] . '}'  : ',"pageSize": 10}';
$filters = (isset($_REQUEST['refinements']) && $_REQUEST['refinements']) ? ',"refinements": ' . $_REQUEST['refinements'] : "";

if (isset($_REQUEST['sort'])) {
    $field = $_REQUEST['sort']['field'];
    $order = $_REQUEST['sort']['order'];
    $sort = ',"sort": { "field": "'.$field.'", "order": "'.$order.'" }';
} else {
    $sort = "";
}
if (isset($_REQUEST['fields'])) {
    $fields = ',"fields":["'.$_REQUEST['fields'][0].'"] ';
} else {
    $fields = ',"fields":["*"] ';
}

$url = "https://wwnorton.groupbycloud.com/api/v1/search?pretty";

$data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","collection":"' . $sitecode.$platform . '","area":"'.$area.'"' .
    $query .
    $fields .
    $sort .
    $filters .
    $skip .
    $pageSize;

//echo $data;exit;
$h=curl_init();
curl_setopt($h, CURLOPT_POST, true);
curl_setopt($h, CURLOPT_POSTFIELDS, $data);
curl_setopt($h, CURLOPT_RETURNTRANSFER, true);
curl_setopt($h, CURLOPT_URL, $url);

$result = curl_exec($h);
curl_close($h);


$result = '{  "code": 200,   "status": "",   "data":' . $result . '}';
header ('Content-Type: text/javascript');
echo $result;
