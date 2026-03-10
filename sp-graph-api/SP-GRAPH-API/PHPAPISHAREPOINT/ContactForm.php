<?php

error_reporting(E_ALL);
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

        if (function_exists('putenv')) {
            putenv(trim($key) . '=' . trim($value));
        }
    }
}

/* ---------------- HEADERS ---------------- */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

/* ---------------- GET INPUT ---------------- */
$input = file_get_contents("php://input");
$query = json_decode($input, true);

if (!$query) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid JSON input"]);
    exit;
}

/* ---------------- GRAPH POST FUNCTION ---------------- */
function graphPostRequest($url, $token, $body) {

    $ch = curl_init($url);

    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => true,
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($body),
        CURLOPT_HTTPHEADER => [
            "Authorization: Bearer $token",
            "Content-Type: application/json"
        ]
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    curl_close($ch);

    if ($httpCode >= 400) {
        throw new Exception("Graph error (HTTP $httpCode): " . $response);
    }

    return json_decode($response, true);
}

try {

    $token = (new GraphToken())->getToken();

    $siteId = $_ENV['SITE_ID'] ?? null;
    $listId = $_ENV['CONTACT_QUERIES_LIST_ID'] ?? null;

    if (!$siteId || !$listId) {
        throw new Exception("Missing SharePoint configuration in .env");
    }

    /* ---------------- SHAREPOINT FIELD DATA ---------------- */

    $spData = [
        "Title" => $query['email'] ?? "Anonymous",

        // Choice column
        "QueryStatus" => $query['status'] ?? "New",

        // JSON text column
        "FormData" => json_encode([
            "fields" => $query['fields'] ?? [],
            "firstName" => $query['firstName'] ?? null,
            "lastName" => $query['lastName'] ?? null,
            "email" => $query['email'] ?? null,
            "pageName" => $query['pageName'] ?? null,
            "containerId" => $query['containerId'] ?? null,
            "created" => $query['created'] ?? date('c')
        ])
    ];

    /* ---------------- LOOKUP FIELD ---------------- */

    // Accept multiple possible pageId formats from frontend
    $pageId = $query['pageId'] ?? $query['SourcePageId'] ?? null;

    if (!empty($pageId)) {

        $normalizedPageId = preg_replace('/[^0-9]/', '', (string)$pageId);

        if ($normalizedPageId) {
            $spData["SourcePageLookupId"] = (int)$normalizedPageId;
        }
    }

    /* ---------------- GRAPH REQUEST ---------------- */

    $url = "https://graph.microsoft.com/v1.0/sites/$siteId/lists/$listId/items";

    $body = [
        "fields" => $spData
    ];

    $response = graphPostRequest($url, $token, $body);

    echo json_encode([
        "success" => true,
        "itemId" => $response["id"] ?? null,
        "response" => $response
    ]);

} catch (Exception $e) {

    http_response_code(500);

    echo json_encode([
        "error" => $e->getMessage()
    ]);
}