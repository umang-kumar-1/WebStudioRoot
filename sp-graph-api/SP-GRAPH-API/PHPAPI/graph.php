<?php

class GraphToken {
    private $cache;
    private $cacheKey = 'graph_token';
    private $cacheTTL = 3500; // ~58 minutes

    public function __construct() {
        // Use APCu if available, otherwise fallback to file-based cache
        if (function_exists('apcu_enabled') && apcu_enabled()) {
            $this->cache = 'apcu';
        } else {
            $this->cache = 'file';
            $cacheDir = __DIR__ . '/cache';
            if (!is_dir($cacheDir)) {
                mkdir($cacheDir, 0755, true);
            }
        }
    }

    private function getCachedToken() {
        if ($this->cache === 'apcu') {
            $cached = apcu_fetch($this->cacheKey);
            if ($cached !== false) {
                return $cached;
            }
        } else {
            $cacheFile = __DIR__ . '/cache/' . md5($this->cacheKey) . '.cache';
            if (file_exists($cacheFile)) {
                $data = json_decode(file_get_contents($cacheFile), true);
                if ($data && isset($data['token']) && isset($data['expires'])) {
                    if (time() < $data['expires']) {
                        return $data['token'];
                    }
                }
            }
        }
        return null;
    }

    private function setCachedToken($token) {
        $expires = time() + $this->cacheTTL;
        
        if ($this->cache === 'apcu') {
            apcu_store($this->cacheKey, $token, $this->cacheTTL);
        } else {
            $cacheFile = __DIR__ . '/cache/' . md5($this->cacheKey) . '.cache';
            file_put_contents($cacheFile, json_encode([
                'token' => $token,
                'expires' => $expires
            ]));
        }
    }

    public function getToken() {
        $cached = $this->getCachedToken();
        if ($cached) {
            return $cached;
        }

        $tenantId = $_ENV['TENANT_ID'] ?? getenv('TENANT_ID');
        $clientId = $_ENV['CLIENT_ID'] ?? getenv('CLIENT_ID');
        $clientSecret = $_ENV['CLIENT_SECRET'] ?? getenv('CLIENT_SECRET');

        if (!$tenantId || !$clientId || !$clientSecret) {
            throw new Exception('Missing required environment variables');
        }

        $url = "https://login.microsoftonline.com/{$tenantId}/oauth2/v2.0/token";

        $data = [
            'client_id' => $clientId,
            'client_secret' => $clientSecret,
            'scope' => 'https://graph.microsoft.com/.default',
            'grant_type' => 'client_credentials'
        ];

        $ch = curl_init($url);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/x-www-form-urlencoded'
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        if ($httpCode !== 200) {
            throw new Exception('Failed to get token: ' . $response);
        }

        $result = json_decode($response, true);
        if (!isset($result['access_token'])) {
            throw new Exception('No access token in response');
        }

        $this->setCachedToken($result['access_token']);
        return $result['access_token'];
    }
}

