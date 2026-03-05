<?php
require_once __DIR__ . '/graph.php';

if (!function_exists('graphRequest')) {
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
}

function getSeoData($pageSlug) {
    try {
        $token = (new GraphToken())->getToken();
        $siteId = $_ENV['SITE_ID'] ?? null;

        if (!$siteId) return null;

        $requestSlug = strtolower(trim($pageSlug, '/'));

        $listMap = [
            "smartPages" => "SMART_PAGES_LIST_ID",
            "news" => "NEWS_LIST_ID",
            "events" => "EVENTS_LIST_ID",
            "containers" => "CONTAINERS_LIST_ID",
            "imageSlider" => "IMAGE_SLIDER_LIST_ID",
            "containerItems" => "CONTAINER_ITEMS_LIST_ID",
            "globalSettings" => "GLOBAL_SETTINGS_LIST_ID",
            "contacts" => "CONTACTS_LIST_ID",
            "contactQueries" => "CONTACT_QUERIES_LIST_ID",
            "topNavigation" => "TOP_NAVIGATION_LIST_ID",
            "translationDictionary" => "TRANSLATION_DICTIONARY_LIST_ID",
            "documentMetaData" => "DOCUMENT_METADATA_LIST_ID"
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
                    "url" => "/sites/$siteId/lists/$listId/items?\$expand=fields(\$select=Title,Slug,Heading,SubHeading,Description,PageContent)"
                ];
                $registry[$id] = ["key" => $key];
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
        $matchedFields = null;

        if (isset($batchResponse['responses'])) {
            foreach ($batchResponse['responses'] as $resp) {
                if ($resp['status'] === 200 && isset($resp['body']['value'])) {
                    foreach ($resp['body']['value'] as $item) {
                        $fields = $item['fields'] ?? [];

                        $itemSlug = isset($fields['Slug']) ? strtolower(trim($fields['Slug'], '/')) : '';
                        if ($itemSlug !== '' && $itemSlug === $requestSlug) {
                            $matchedFields = $fields;
                            break 2;
                        }
                        
                        if (isset($fields['Title'])) {
                            $titleNoSpaceDash = strtolower(str_replace([' ', '-'], '', $fields['Title']));
                            $requestNoSpaceDash = str_replace([' ', '-'], '', $requestSlug);
                            $titleDashed = strtolower(str_replace(' ', '-', trim($fields['Title'])));
                            
                            if (($titleNoSpaceDash === $requestNoSpaceDash && $requestNoSpaceDash !== '') || 
                                ($titleDashed === $requestSlug && $requestSlug !== '')) {
                                $matchedFields = $fields;
                                break 2;
                            }
                        }
                    }
                }
            }

            if (!$matchedFields && ($requestSlug === '' || $requestSlug === '/')) {
                foreach ($batchResponse['responses'] as $resp) {
                    if ($resp['status'] === 200 && isset($resp['body']['value'])) {
                        foreach ($resp['body']['value'] as $item) {
                            $fields = $item['fields'] ?? [];
                            $itemTitle = isset($fields['Title']) ? strtolower(trim($fields['Title'])) : '';
                            if (strpos($itemTitle, 'home') !== false || strpos($itemTitle, 'start') !== false || $itemTitle === 'index') {
                                $matchedFields = $fields;
                                break 2;
                            }
                        }
                    }
                }
            }
        }

        if (!$matchedFields) return null;

        $description = $matchedFields['Description'] ?? "";
        if (empty(trim($description))) {
            if (!empty($matchedFields['SubHeading'])) {
                $description = strip_tags($matchedFields['SubHeading']);
            } elseif (!empty($matchedFields['PageContent'])) {
                $description = strip_tags(substr($matchedFields['PageContent'], 0, 160)) . '...';
            }
        }

        return [
            "title" => $matchedFields["Title"] ?? "",
            "heading" => $matchedFields["Heading"] ?? "",
            "subHeading" => $matchedFields["SubHeading"] ?? "",
            "description" => $description,
        ];

    } catch (Exception $e) {
        return null;
    }
}
