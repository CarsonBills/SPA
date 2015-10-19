<?php
$query = (isset($_REQUEST['query']) && $_REQUEST['query']) ? ',"query"' . ': ' . '"'.$_REQUEST['query'].'"' : "";

$skip = (isset($_REQUEST['skip']) && (int)$_REQUEST['skip'] > 0) ? (int)$_REQUEST['skip'] : 0;
$pageSize = (isset($_REQUEST['pageSize']) && (int)$_REQUEST['pageSize'] > 0) ? (int)$_REQUEST['pageSize'] : 12;

$type = (isset($_REQUEST['typ']) && (int)$_REQUEST['typ'] > 0) ? (int)$_REQUEST['typ'] : 1;

if ($type === 1) {
    //$data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","area":"Production","fields":["*"],"skip":0,"pageSize":12}';
    $data='{"clientKey":"8fd00c47-8378-455c-a1bc-e4f1f1704b87","collection":"nortonreadertwo","area":"Production"' . $query . ',"fields":["*"], "skip":' . $skip . ',"pageSize":' . $pageSize . '}';
    $url = "https://wwnorton.groupbycloud.com/api/v1/search?pretty";
} elseif ($type == 2) {
    $data='{ "navigationName": "brand", "originalQuery":{"query": "dvd", "clientKey": "8fd00c47-8378-455c-a1bc-e4f1f1704b87"} }';
    $data='{ "navigationName": "*", "originalQuery":{"query": "*", "clientKey": "8fd00c47-8378-455c-a1bc-e4f1f1704b87"} }';
    $url = "https://mycompany.groupbycloud.com/api/v1/search/refinements";

}
//echo $url."<BR><BR>";
$h=curl_init();
curl_setopt($h, CURLOPT_POST, true);
curl_setopt($h, CURLOPT_POSTFIELDS, $data);
curl_setopt($h, CURLOPT_RETURNTRANSFER, true);
curl_setopt($h, CURLOPT_URL, $url);

$result = curl_exec($h);
curl_close($h);

header ('Content-Type: text/javascript');
echo $result;
