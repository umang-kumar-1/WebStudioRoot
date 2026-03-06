<?php

// Basic CORS & JSON headers
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/graph.php';

// ENV loader (same as index.php)
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || strpos($line, '=') === false) {
            continue;
        }
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

function sendJsonBatch($data, $status = 200) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);
    echo json_encode($data);
    exit;
}

function graphRequestBatch($url, $token) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token"
        ]
    ]);

    $response = curl_exec($ch);
    $error = curl_error($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode !== 200) {
        throw new Exception("Graph error (HTTP $httpCode): " . ($error ?: $response));
    }

    return json_decode($response, true);
}

// Only support GET for this endpoint
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendJsonBatch(['error' => 'Method not allowed'], 405);
}

try {
    $token = (new GraphToken())->getToken();
    $siteId = $_ENV['SITE_ID'];

    $listMap = [
        "containers" => "CONTAINERS_LIST_ID",
        "events" => "EVENTS_LIST_ID",
        "news" => "NEWS_LIST_ID",
        "containerItems" => "CONTAINER_ITEMS_LIST_ID",
        "globalSettings" => "GLOBAL_SETTINGS_LIST_ID",
        "contacts" => "CONTACTS_LIST_ID",
        "smartPages" => "SMART_PAGES_LIST_ID",
        "contactQueries" => "CONTACT_QUERIES_LIST_ID",
        "imageSlider" => "IMAGE_SLIDER_LIST_ID",
        "topNavigation" => "TOP_NAVIGATION_LIST_ID",
        "translationDictionary" => "TRANSLATION_DICTIONARY_LIST_ID",
        "documentMetaData" => "DOCUMENT_METADATA_LIST_ID"
    ];

    $data = [];

    foreach ($listMap as $key => $envKey) {
        $listId = $_ENV[$envKey] ?? null;

        if (!$listId) {
            $data[$key] = [];
            continue;
        }

        $url = "https://graph.microsoft.com/v1.0/sites/$siteId/lists/$listId/items?\$expand=fields(\$select=*)";
        $response = graphRequestBatch($url, $token);

        $items = array_map(function ($item) {
            return array_merge(
                ["id" => $item["id"]],
                $item["fields"]
            );
        }, $response["value"]);

        $data[$key] = $items;
    }

    sendJsonBatch($data);

} catch (Exception $e) {
    sendJsonBatch(["error" => $e->getMessage()], 500);
}

