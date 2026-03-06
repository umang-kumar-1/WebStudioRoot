<?php

class GraphToken {

    private $cacheFile;

    public function __construct() {
        $this->cacheFile = __DIR__ . '/token_cache.json';
    }

    public function getToken() {

        /* ================================
           1️⃣ CHECK CACHED TOKEN
        ================================= */

        if (file_exists($this->cacheFile)) {

            $cached = json_decode(file_get_contents($this->cacheFile), true);

            if (
                $cached &&
                isset($cached['access_token']) &&
                isset($cached['expires_at']) &&
                time() < $cached['expires_at']
            ) {
                return $cached['access_token'];
            }
        }

        /* ================================
           2️⃣ REQUEST NEW TOKEN
        ================================= */

        $tenantId = $_ENV['TENANT_ID'] ?? null;
        $clientId = $_ENV['CLIENT_ID'] ?? null;
        $clientSecret = $_ENV['CLIENT_SECRET'] ?? null;

        if (!$tenantId || !$clientId || !$clientSecret) {
            throw new Exception("Graph credentials missing in .env");
        }

        $url = "https://login.microsoftonline.com/$tenantId/oauth2/v2.0/token";

        $postData = http_build_query([
            "client_id" => $clientId,
            "client_secret" => $clientSecret,
            "scope" => "https://graph.microsoft.com/.default",
            "grant_type" => "client_credentials"
        ]);

        $ch = curl_init($url);

        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => [
                "Content-Type: application/x-www-form-urlencoded"
            ]
        ]);

        $response = curl_exec($ch);

        if ($response === false) {
            throw new Exception("Curl error: " . curl_error($ch));
        }

        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($httpCode !== 200) {
            throw new Exception("Token request failed (HTTP $httpCode): " . $response);
        }

        $data = json_decode($response, true);

        if (!isset($data['access_token'])) {
            throw new Exception("Invalid token response");
        }

        /* ================================
           3️⃣ CACHE TOKEN
        ================================= */

        $expiresAt = time() + ($data['expires_in'] - 120); // expire 2 min early

        $cacheData = [
            "access_token" => $data['access_token'],
            "expires_at" => $expiresAt
        ];

        // safe write
        $fp = fopen($this->cacheFile, 'c+');
        if ($fp) {
            flock($fp, LOCK_EX);
            ftruncate($fp, 0);
            fwrite($fp, json_encode($cacheData));
            fflush($fp);
            flock($fp, LOCK_UN);
            fclose($fp);
        }

        return $data['access_token'];
    }
}