<?php

error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 0);

require_once __DIR__ . '/graph.php';

/* ---------------- ENV LOADER ---------------- */
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

/* ---------------- HEADERS ---------------- */

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ---------------- ROUTING ---------------- */

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

$basePath = dirname($_SERVER['SCRIPT_NAME']);

$path = trim(str_replace($basePath, '', $requestUri), '/');

$method = $_SERVER['REQUEST_METHOD'];

/* ---------------- RESPONSE HELPER ---------------- */

function sendJson($data, $status = 200)
{
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);
    echo json_encode($data);
    exit;
}

/* ---------------- HEALTH ---------------- */

if ($path === "health" || $path === "api/health") {

    sendJson([
        "message" => "API Running",
        "path" => $path,
        "method" => $method,
        "env_loaded" => isset($_ENV['SITE_ID']),
        "php_version" => PHP_VERSION,
        "curl_exists" => function_exists('curl_init')
    ]);
}

/* ---------------- GRAPH REQUEST ---------------- */

function graphRequest($url, $token)
{
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

/* =========================================================
   DOCUMENT LIBRARY
   ========================================================= */

if ($path === "api/publishing-documents" && $method === "GET") {

    try {

        $token = (new GraphToken())->getToken();

        $driveId = $_ENV['DOCUMENTS_DRIVE_ID'];

        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/root/search(q='')?\$select=id,name,file,folder,parentReference";

        $response = graphRequest($url, $token);

        $items = array_map(function ($i) {

            return [
                "id" => $i["id"],
                "name" => $i["name"],
                "type" => isset($i["folder"]) ? "folder" : "file",
                "parentId" => $i["parentReference"]["id"] ?? null,
                "url" => null
            ];
        }, $response["value"]);

        sendJson($items);

    } catch (Exception $e) {

        sendJson(["error" => $e->getMessage()]);
    }
}

/* =========================================================
   PUBLISHING IMAGES
   ========================================================= */

if ($path === "api/publishing-images" && $method === "GET") {

    try {

        $token = (new GraphToken())->getToken();

        $driveId = $_ENV['PUBLISHING_IMAGES_DRIVE_ID'];

        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/root/search(q='')?\$select=id,name,file,folder,parentReference,@microsoft.graph.downloadUrl,thumbnails";

        $response = graphRequest($url, $token);

        $items = array_map(function ($i) {

            return [
                "id" => $i["id"],
                "name" => $i["name"],
                "type" => isset($i["folder"]) ? "folder" : "image",
                "parentId" => $i["parentReference"]["id"] ?? null,
                "url" => $i["@microsoft.graph.downloadUrl"] ?? null,
                "thumbnail" => $i["thumbnails"][0]["large"]["url"] ?? null
            ];
        }, $response["value"]);

        sendJson($items);

    } catch (Exception $e) {

        sendJson(["error" => $e->getMessage()]);
    }
}

/* =========================================================
   VIEW FILE
   ========================================================= */

if (preg_match('#^api/view-file/(documents|images)/(.+)$#', $path, $matches)) {

    try {

        $token = (new GraphToken())->getToken();

        $driveType = $matches[1];

        $fileId = $matches[2];

        $driveMap = [

            "documents" => $_ENV['DOCUMENTS_DRIVE_ID'],

            "images" => $_ENV['PUBLISHING_IMAGES_DRIVE_ID']
        ];

        $driveId = $driveMap[$driveType] ?? null;

        if (!$driveId) {

            http_response_code(400);
            exit;
        }

        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/items/$fileId/content";

        $ch = curl_init($url);

        curl_setopt_array($ch, [

            CURLOPT_RETURNTRANSFER => true,

            CURLOPT_FOLLOWLOCATION => false,

            CURLOPT_HTTPHEADER => [

                "Authorization: Bearer $token"
            ]
        ]);

        curl_exec($ch);

        $redirectUrl = curl_getinfo($ch, CURLINFO_REDIRECT_URL);

        if ($redirectUrl) {

            header("Location: $redirectUrl", true, 302);

            exit;
        }

        http_response_code(404);

        exit;

    } catch (Exception $e) {

        http_response_code(500);

        exit;
    }
}

/* =========================================================
   BATCH API
   ========================================================= */

if ($path === "api/batch" && $method === "GET") {

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

            $response = graphRequest($url, $token);

            $items = array_map(function ($item) {

                return array_merge(

                    ["id" => $item["id"]],

                    $item["fields"]
                );

            }, $response["value"]);

            $data[$key] = $items;
        }

        sendJson($data);

    } catch (Exception $e) {

        sendJson(["error" => $e->getMessage()], 500);
    }
}

/* =========================================================
   DYNAMIC LIST API
   ========================================================= */

if (preg_match('#^api/(.+)$#', $path, $matches) && $method === "GET") {

    try {

        $endpoint = $matches[1];

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

        if (!isset($listMap[$endpoint])) {

            sendJson([]);
        }

        $token = (new GraphToken())->getToken();

        $siteId = $_ENV['SITE_ID'];

        $listId = $_ENV[$listMap[$endpoint]] ?? null;

        if (!$listId) {

            sendJson([]);
        }

        $url = "https://graph.microsoft.com/v1.0/sites/$siteId/lists/$listId/items?\$expand=fields(\$select=*)";

        $response = graphRequest($url, $token);

        $items = array_map(function ($item) {

            return array_merge(

                ["id" => $item["id"]],

                $item["fields"]
            );

        }, $response["value"]);

        sendJson($items);

    } catch (Exception $e) {

        sendJson([]);
    }
}

/* ---------------- DEFAULT ---------------- */

sendJson(["error" => "Endpoint not found"], 404);