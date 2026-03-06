<?php

error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 0);

require_once __DIR__ . '/graph.php';

/* ---------------- ENV LOADER ---------------- */
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || strpos($line, '#') === 0 || !str_contains($line, '=')) continue;

        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

/* ---------------- HEADERS ---------------- */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, Access-Control-Allow-Headers");
header("Access-Control-Max-Age: 3600");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

/* ---------------- ROUTING ---------------- */
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
// Normalize: strip subdirectory and leading/trailing slashes
$path = trim(str_replace('/PHPAPISHAREPOINT', '', $uri), '/');
$method = $_SERVER['REQUEST_METHOD'];

/* ---------------- RESPONSE HELPER ---------------- */
function sendJson($data, $status = 200) {
    header("Content-Type: application/json; charset=UTF-8");
    http_response_code($status);
    echo json_encode($data);
    exit;
}

/* ---------------- GRAPH REQUEST ---------------- */
function graphRequest($url, $token) {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token"
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($httpCode !== 200) {
        throw new Exception("Graph error: " . $response);
    }

    return json_decode($response, true);
}

/* ---------------- HEALTH ---------------- */
if ($path === "health") {
    sendJson(["message" => "API Running"]);
}

/* =========================================================
   DOCUMENT LIBRARY (Folders + Files + Recursive)
   ========================================================= */
if ($path === "api/publishing-documents" && $method === "GET") {

    try {
        $token = (new GraphToken())->getToken();
        $driveId = $_ENV['DOCUMENTS_DRIVE_ID'];
        
        // Use search(q='') to get all items recursively in one go
        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/root/search(q='')?\$select=id,name,file,folder,parentReference";

        $response = graphRequest($url, $token);

        $items = array_map(function($i) {
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
   PICTURE LIBRARY (Folders + Images + Recursive)
   ========================================================= */
if ($path === "api/publishing-images" && $method === "GET") {

    try {
        $token = (new GraphToken())->getToken();
        $driveId = $_ENV['PUBLISHING_IMAGES_DRIVE_ID'];

        // Use search(q='') to get all items recursively in one go
        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/root/search(q='')?\$select=id,name,file,folder,parentReference,@microsoft.graph.downloadUrl,thumbnails";

        $response = graphRequest($url, $token);

        $items = array_map(function($i) {
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
   VIEW FILE (Documents & Images) - Faster Redirect
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

        // Instead of proxying the whole file (slow), we get the redirect URL
        $url = "https://graph.microsoft.com/v1.0/drives/$driveId/items/$fileId/content";

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => false, // We want the redirect URL
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token"
            ]
        ]);

        curl_exec($ch);
        $redirectUrl = curl_getinfo($ch, CURLINFO_REDIRECT_URL);

        if ($redirectUrl) {
            header("Location: $redirectUrl", true, 302);
            exit;
        } else {
            // Fallback to proxy if no redirect (shouldn't happen for content)
            header("Content-Type: application/octet-stream");
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
            curl_exec($ch);
            exit;
        }

    } catch (Exception $e) {
        http_response_code(500);
        exit;
    }
}

/* =========================================================
   SHAREPOINT LIST (Fixed Routing Issue)
   ========================================================= */
if ($path === "sharepoint-list" && $method === "GET") {

    try {
        $token = (new GraphToken())->getToken();

        $siteId = $_ENV['SITE_ID'];
        $listId = $_ENV['CONTAINERS_LIST_ID'];

        if (!$siteId || !$listId) {
            sendJson("SITE_ID or LIST_ID missing", 500);
        }

        $url = "https://graph.microsoft.com/v1.0/sites/$siteId/lists/$listId/items?expand=fields";
        $response = graphRequest($url, $token);

        $items = array_map(fn($i) => $i["fields"], $response["value"]);

        sendJson($items);

    } catch (Exception $e) {
        sendJson($e->getMessage(), 500);
    }
}

/* =========================================================
   BATCH API (Consolidate multiple list requests)
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
        
        $driveMap = [
            "allImagesRaw" => "PUBLISHING_IMAGES_DRIVE_ID",
            "spDocsRaw" => "DOCUMENTS_DRIVE_ID"
        ];

        $requests = [];
        $registry = [];
        $idCounter = 1;
        
        foreach ($listMap as $key => $envKey) {
            $listId = $_ENV[$envKey] ?? null;
            if ($listId) {
                $id = (string)$idCounter++;
                $requests[] = [
                    "id" => $id,
                    "method" => "GET",
                    "url" => "/sites/$siteId/lists/$listId/items?\$expand=fields(\$select=*)"
                ];
                $registry[$id] = ["key" => $key, "type" => "list"];
            }
        }

        foreach ($driveMap as $key => $envKey) {
            $driveId = $_ENV[$envKey] ?? null;
            if ($driveId) {
                $id = (string)$idCounter++;
                $requests[] = [
                    "id" => $id,
                    "method" => "GET",
                    "url" => "/drives/$driveId/root/search(q='')?\$select=id,name,file,folder,parentReference,@microsoft.graph.downloadUrl,thumbnails"
                ];
                $registry[$id] = ["key" => $key, "type" => "drive"];
            }
        }

        $batchUrl = "https://graph.microsoft.com/v1.0/\$batch";
        $ch = curl_init($batchUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => json_encode(["requests" => $requests]),
            CURLOPT_HTTPHEADER => [
                "Authorization: Bearer $token",
                "Content-Type: application/json"
            ]
        ]);

        $batchResponse = json_decode(curl_exec($ch), true);
        $finalResult = [];

        foreach ($batchResponse['responses'] as $resp) {
            $id = $resp['id'];
            $info = $registry[$id] ?? null;
            if (!$info) continue;
            
            $key = $info["key"];
            if ($resp['status'] === 200) {
                if ($info["type"] === "list") {
                    $items = array_map(function ($item) {
                        return array_merge(["id" => $item["id"]], $item["fields"]);
                    }, $resp['body']['value']);
                    $finalResult[$key] = $items;
                } else {
                    $items = array_map(function($i) use ($key) {
                        return [
                            "id" => $i["id"],
                            "name" => $i["name"],
                            "type" => isset($i["folder"]) ? "folder" : ($key === "allImagesRaw" ? "image" : "file"),
                            "parentId" => $i["parentReference"]["id"] ?? null,
                            "url" => $i["@microsoft.graph.downloadUrl"] ?? null,
                            "thumbnail" => $i["thumbnails"][0]["large"]["url"] ?? null
                        ];
                    }, $resp['body']['value']);
                    $finalResult[$key] = $items;
                }
            } else {
                $finalResult[$key] = [];
            }
        }

        sendJson($finalResult);

    } catch (Exception $e) {
        sendJson(["error" => $e->getMessage()], 500);
    }
}

/* =========================================================
   SEO API (All Lists)
   ========================================================= */

require_once __DIR__ . '/seo_helper.php';

if ($path === "api/seo" && $method === "GET") {
    $page = $_GET['page'] ?? '';
    if ($page === '' || $page === 'home') {
        $page = '/';
    }

    $seo = getSeoData($page);

    if (!$seo) {
        sendJson([]);
    }

    sendJson($seo);
}


/* =========================================================
   DYNAMIC SHAREPOINT LIST HANDLER
   Matches:
   /api/containers
   /api/events
   /api/news
   etc...
   ========================================================= */

if (preg_match('#^api/(.+)$#', $path, $matches) && $method === "GET") {

    try {

        $token = (new GraphToken())->getToken();
        $siteId = $_ENV['SITE_ID'];

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

// If we reached here, it's not a defined API endpoint.
// Check if it's an API attempt or a page request.
if (strpos($path, 'api/') === 0) {
    sendJson("API Endpoint not found", 404);
} else {
    // Treat as a page request and load the HTML loader
    include __DIR__ . '/page.php';
}