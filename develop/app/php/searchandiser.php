<?php
$query = (isset($_REQUEST['query']) && $_REQUEST['query']) ? ',"query"' . ': ' . '"'.$_REQUEST['query'].'"' : "";

$skip = (isset($_REQUEST['skip']) && (int)$_REQUEST['skip'] > 0) ? (int)$_REQUEST['skip'] : 0;
$pageSize = (isset($_REQUEST['pageSize']) && (int)$_REQUEST['pageSize'] > 0) ? (int)$_REQUEST['pageSize'] : 6;
$filters = (isset($_REQUEST['refinements']) && $_REQUEST['refinements']) ? ',"refinements": ' . $_REQUEST['refinements'] : "";

    $url = "https://wwnorton.groupbycloud.com/api/v1/search?pretty";

     $data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","collection":"nortonreader","area":"Production"' .
        $query .
        ',"fields":["*"] ' .
        $filters .
        ',"skip":' . $skip .
        ',"pageSize":' . $pageSize . '}';


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
