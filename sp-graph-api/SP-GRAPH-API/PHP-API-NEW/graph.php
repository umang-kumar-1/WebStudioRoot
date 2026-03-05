<?php

class GraphToken {

    private $cacheFile = __DIR__ . '/token_cache.json';

    public function getToken() {

        // 1️⃣ Check cached token
        if (file_exists($this->cacheFile)) {
            $cached = json_decode(file_get_contents($this->cacheFile), true);

            if ($cached && isset($cached['access_token'], $cached['expires_at'])) {
                if (time() < $cached['expires_at']) {
                    return $cached['access_token']; // ✅ reuse token
                }
            }
        }

        // 2️⃣ Request new token
        $tenantId = $_ENV['TENANT_ID'];
        $clientId = $_ENV['CLIENT_ID'];
        $clientSecret = $_ENV['CLIENT_SECRET'];

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
        $data = json_decode($response, true);

        if (!isset($data['access_token'])) {
            throw new Exception("Token request failed");
        }

        $expiresAt = time() + ($data['expires_in'] - 60); // expire 1 min early

        // 3️⃣ Save to file
        file_put_contents($this->cacheFile, json_encode([
            "access_token" => $data['access_token'],
            "expires_at" => $expiresAt
        ]));

        return $data['access_token'];
    }
}