# SP Graph API - PHP Version

This is the PHP version of the SharePoint Graph API server.

## Requirements

- PHP 7.4 or higher
- cURL extension enabled
- APCu extension (optional, for better caching performance)

## Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   
   **Note:** `.env.example` is just a template file. You need to create `.env` file with your actual credentials. The `.env` file is ignored by git (see `.gitignore`).

2. Edit `.env` and add your Microsoft Graph API credentials:
   ```
   TENANT_ID=your-tenant-id
   CLIENT_ID=your-client-id
   CLIENT_SECRET=your-client-secret
   DOCUMENTS_DRIVE_ID=your-documents-drive-id
   PUBLISHING_IMAGES_DRIVE_ID=your-publishing-images-drive-id
   ```

3. Make sure the `cache` directory is writable:
   ```bash
   chmod 755 cache
   ```

## Running the API

### Using PHP Built-in Server (Development)

```bash
php -S localhost:8000 -t .
```

Then access: `http://localhost:8000/api/health`

### Using Apache

1. Place the files in your Apache document root
2. Ensure mod_rewrite is enabled
3. The `.htaccess` file will handle routing

### Using Nginx

Add this configuration:

```nginx
location /api {
    try_files $uri $uri/ /api/index.php?$query_string;
}
```

## API Endpoints

### Health Check
```
GET /api/health
```

### List Documents
```
GET /api/list
GET /api/list?folderId=...
```

### List Publishing Images
```
GET /api/publishing-images
GET /api/publishing-images?folderId=...
```

### View File
```
GET /api/view-file/images/:fileId
GET /api/view-file/documents/:fileId
```

## Features

- OAuth2 token caching (58 minutes TTL)
- CORS enabled
- Error handling
- File streaming for file viewing

## Notes

- Token caching uses APCu if available, otherwise falls back to file-based caching
- Cache directory will be created automatically if it doesn't exist
- All endpoints match the Node.js version functionality

