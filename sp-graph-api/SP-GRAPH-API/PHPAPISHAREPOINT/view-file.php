<?php

// Basic CORS headers
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

// Only support GET for this endpoint
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit;
}

$driveType = isset($_GET['type']) ? $_GET['type'] : '';
$fileId = isset($_GET['id']) ? $_GET['id'] : '';

if (!$driveType || !$fileId) {
    http_response_code(400);
    exit;
}

try {
    $token = (new GraphToken())->getToken();

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

