<?php

error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', 0);

/* ---------------- ENV LOADER ---------------- */

if (file_exists(__DIR__ . '/.env')) {

    $lines = file(__DIR__ . '/.env', FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);

    foreach ($lines as $line) {

        $line = trim($line);

        if ($line === '' || strpos($line, '#') === 0 || !str_contains($line, '=')) {
            continue;
        }

        list($key, $value) = explode('=', $line, 2);

        $_ENV[trim($key)] = trim($value);
        putenv(trim($key) . '=' . trim($value));
    }
}

/* ---------------- SITE CONFIG ---------------- */

$SITE_URL = $_ENV['REACT_APP_SITE_URL'] ?? "https://webstudio.example.com";

$SITE_NAME = "Web Studio";

$DEFAULT_TITLE = "Web Studio | Empowering Your Digital Workspace";
$DEFAULT_DESC = "Explore Web Studio, your all-in-one corporate intranet solution.";

/* ---------------- DETECT PAGE ---------------- */

$page = $_GET['page'] ?? trim(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH), '/');

if ($page === "" || $page === "page.php" || $page === "index.php") {
    $page = "/";
}

/* ---------------- DEFAULT SEO ---------------- */

$pageTitle = $DEFAULT_TITLE;
$pageDesc = $DEFAULT_DESC;
$pageHeading = "";
$pageSubHeading = "";
$pageContent = "";

/* ---------------- FETCH SEO ---------------- */

require_once __DIR__ . '/seo_helper.php';
$seoData = getSeoData($page);

if (!empty($seoData)) {

    if (!empty($seoData["title"])) {
        $pageTitle = $seoData["title"] . " | " . $SITE_NAME;
    }

    if (!empty($seoData["description"])) {
        $pageDesc = strip_tags($seoData["description"]);
        $pageContent = $seoData["description"];
    }

    if (!empty($seoData["heading"])) {
        $pageHeading = $seoData["heading"];
    }

    if (!empty($seoData["subHeading"])) {
        $pageSubHeading = $seoData["subHeading"];
    }

}

/* ---------------- REACT BUILD FILES ---------------- */

$mainJS = null;
$mainCSS = null;

if (is_dir(__DIR__ . '/dist/assets')) {

    foreach (scandir(__DIR__ . '/dist/assets') as $file) {

        if (strpos($file, 'index') === 0 && strpos($file, '.js') !== false) {
            $mainJS = '/dist/assets/' . $file;
        }

        if (strpos($file, 'index') === 0 && strpos($file, '.css') !== false) {
            $mainCSS = '/dist/assets/' . $file;
        }

    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>

<meta charset="UTF-8">

<meta name="viewport" content="width=device-width, initial-scale=1">

<title><?php echo htmlspecialchars($pageTitle); ?></title>

<meta name="description" content="<?php echo htmlspecialchars($pageDesc); ?>">

<meta name="robots" content="index, follow">

<link rel="canonical" href="<?php echo htmlspecialchars($SITE_URL . '/' . ltrim($page, '/')); ?>">

<meta property="og:title" content="<?php echo htmlspecialchars($pageTitle); ?>">

<meta property="og:description" content="<?php echo htmlspecialchars($pageDesc); ?>">

<meta property="og:type" content="website">

<?php if ($mainCSS): ?>

<link rel="stylesheet" href="<?php echo htmlspecialchars($mainCSS); ?>">

<?php endif; ?>

</head>

<body>

<div style="visibility:hidden; position:absolute; left:-9999px">

<h1><?php echo htmlspecialchars($pageHeading ?: $pageTitle); ?></h1>

<?php if ($pageSubHeading) { ?>

<h2><?php echo htmlspecialchars($pageSubHeading); ?></h2>

<?php } ?>

<?php if ($pageContent) { ?>

<p><?php echo htmlspecialchars(substr(strip_tags($pageContent), 0, 300)); ?></p>

<?php } ?>

</div>

<noscript>You need to enable JavaScript to run this app.</noscript>

<div id="root"></div>

<?php if ($mainJS): ?>

<script src="<?php echo htmlspecialchars($mainJS); ?>" defer></script>

<?php endif; ?>

</body>

</html>