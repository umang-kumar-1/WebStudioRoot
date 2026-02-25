<?php

require_once __DIR__ . '/graph.php';

// Load environment variables from .env file
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos(trim($line), '#') === 0) continue;
        list($key, $value) = explode('=', $line, 2);
        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

// Enable CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Get request URI and method
$requestUri = $_SERVER['REQUEST_URI'];
$requestMethod = $_SERVER['REQUEST_METHOD'];
$parsedUrl = parse_url($requestUri);
$path = $parsedUrl['path'];
$queryParams = [];
if (isset($parsedUrl['query'])) {
    parse_str($parsedUrl['query'], $queryParams);
}

// Remove base path if running in subdirectory
// Handle both /api/... and direct paths
$basePath = '/api';
if (strpos($path, $basePath) === 0) {
    $path = substr($path, strlen($basePath));
}
// Remove leading slash if present
$path = ltrim($path, '/');

// Helper function to send JSON response
function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode($data);
    exit;
}

// Helper function to make Graph API request
function makeGraphRequest($url, $token) {
    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Authorization: Bearer ' . $token
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode !== 200) {
        throw new Exception('Graph API error: ' . $response);
    }

    return json_decode($response, true);
}

// Health check endpoint
if ($path === 'health' && $requestMethod === 'GET') {
    sendJson(['status' => 'PHP API running']);
}

// List Documents endpoint
if ($path === 'list' && $requestMethod === 'GET') {
    try {
        $graphToken = new GraphToken();
        $token = $graphToken->getToken();
        $folderId = $queryParams['folderId'] ?? null;
        $driveId = $_ENV['DOCUMENTS_DRIVE_ID'] ?? getenv('DOCUMENTS_DRIVE_ID');

        if (!$driveId) {
            sendJson(['error' => 'DOCUMENTS_DRIVE_ID not configured'], 500);
        }

        $url = $folderId
            ? "https://graph.microsoft.com/v1.0/drives/{$driveId}/items/{$folderId}/children"
            : "https://graph.microsoft.com/v1.0/drives/{$driveId}/root/children";

        $response = makeGraphRequest($url, $token);

        $items = array_map(function($i) {
            return [
                'id' => $i['id'],
                'name' => $i['name'],
                'type' => isset($i['folder']) ? 'folder' : 'file',
                'mimeType' => $i['file']['mimeType'] ?? null
            ];
        }, $response['value']);

        sendJson($items);
    } catch (Exception $err) {
        error_log('LIST ERROR: ' . $err->getMessage());
        sendJson(['error' => 'Unable to list documents'], 500);
    }
}

// Publishing Images endpoint
if ($path === 'publishing-images' && $requestMethod === 'GET') {
    try {
        $graphToken = new GraphToken();
        $token = $graphToken->getToken();
        $folderId = $queryParams['folderId'] ?? null;
        $driveId = $_ENV['PUBLISHING_IMAGES_DRIVE_ID'] ?? getenv('PUBLISHING_IMAGES_DRIVE_ID');

        if (!$driveId) {
            sendJson(['error' => 'PUBLISHING_IMAGES_DRIVE_ID not configured'], 500);
        }

        $url = $folderId
            ? "https://graph.microsoft.com/v1.0/drives/{$driveId}/items/{$folderId}/children"
            : "https://graph.microsoft.com/v1.0/drives/{$driveId}/root/children";

        $response = makeGraphRequest($url, $token);

        $items = array_map(function($i) {
            return [
                'id' => $i['id'],
                'name' => $i['name'],
                'type' => isset($i['folder']) ? 'folder' : 'image',
                'mimeType' => $i['file']['mimeType'] ?? null
            ];
        }, $response['value']);

        sendJson($items);
    } catch (Exception $err) {
        error_log('PUBLISHING IMAGES ERROR: ' . $err->getMessage());
        sendJson(['error' => 'Unable to load PublishingImages'], 500);
    }
}

// View File endpoint
if (preg_match('#^view-file/(images|documents)/(.+)$#', $path, $matches) && $requestMethod === 'GET') {
    try {
        $graphToken = new GraphToken();
        $token = $graphToken->getToken();
        $drive = $matches[1];
        $fileId = $matches[2];

        $driveMap = [
            'images' => $_ENV['PUBLISHING_IMAGES_DRIVE_ID'] ?? getenv('PUBLISHING_IMAGES_DRIVE_ID'),
            'documents' => $_ENV['DOCUMENTS_DRIVE_ID'] ?? getenv('DOCUMENTS_DRIVE_ID')
        ];

        $driveId = $driveMap[$drive];
        if (!$driveId) {
            sendJson(['error' => 'Invalid drive type'], 400);
        }

        $url = "https://graph.microsoft.com/v1.0/drives/{$driveId}/items/{$fileId}/content";

        // Clear the default JSON Content-Type header for file streaming
        header_remove('Content-Type');
        
        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, false);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $token,
            'Accept-Encoding: identity'
        ]);

        // Get headers first
        curl_setopt($ch, CURLOPT_HEADERFUNCTION, function($curl, $header) {
            $len = strlen($header);
            $header = explode(':', $header, 2);
            if (count($header) < 2) return $len;
            
            $name = strtolower(trim($header[0]));
            $value = trim($header[1]);
            
            if (in_array($name, ['content-type', 'content-length'])) {
                header("{$name}: {$value}");
            }
            
            return $len;
        });

        header('Content-Disposition: inline');
        header('Cache-Control: public, max-age=3600');

        curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            sendJson(['error' => 'Unable to view file'], 500);
        }
        exit;
    } catch (Exception $err) {
        error_log('VIEW FILE ERROR: ' . $err->getMessage());
        sendJson(['error' => 'Unable to view file'], 500);
    }
}

// 404 Not Found
http_response_code(404);
sendJson(['error' => 'Endpoint not found']);

