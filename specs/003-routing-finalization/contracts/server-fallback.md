# Server Fallback Contract

## Express Server Routes

### Route Pattern: `GET /*`
**Purpose**: Serve complete HTML pages for any route when JavaScript unavailable
**Handler**: Fallback route handler (catch-all)

**Request**:
```
GET /projects HTTP/1.1
Host: localhost:3000
Accept: text/html
```

**Response Success (200)**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Projects | Tim Radtke</title>
  <link rel="stylesheet" href="/pages/projects/projects.css">
  <link rel="stylesheet" href="/global.css">
</head>
<body>
  <header><!-- Full navigation --></header>
  <main>
    <h1>Projects</h1>
    <!-- Complete page content -->
  </main>
  <script type="module" src="/pages/projects/projects.js"></script>
</body>
</html>
```

**Response Not Found (404)**:
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Page Not Found | Tim Radtke</title>
</head>
<body>
  <h1>404 - Page Not Found</h1>
  <p>The requested page could not be found.</p>
  <a href="/">Return to Home</a>
</body>
</html>
```

### Static Asset Serving

#### Route Pattern: `GET /static/*`
**Purpose**: Serve static assets (resume.pdf, images, etc.)

#### Route Pattern: `GET /dist/*`  
**Purpose**: Serve built application assets (JavaScript, CSS bundles)

## File Resolution Strategy

### Page Resolution
```javascript
// Request: GET /projects
// Resolution path:
1. Check: src/pages/projects/projects.html
2. If exists: Serve complete page
3. If not exists: Serve 404.html

// Request: GET /
// Resolution path:  
1. Check: src/pages/home/home.html (home as default)
2. If exists: Serve complete page
3. If not exists: Serve 404.html
```

### Asset Resolution
```javascript
// Request: GET /static/resume.pdf
// Resolution: static/resume.pdf

// Request: GET /pages/projects/projects.css
// Resolution: src/pages/projects/projects.css
```

## Progressive Enhancement

### No JavaScript Scenario
1. User navigates to any URL
2. Server serves complete HTML page
3. All navigation links work via standard HTTP requests
4. Full functionality maintained without client-side routing

### JavaScript Available Scenario
1. Initial page load serves complete HTML
2. JavaScript initializes SPA router
3. Subsequent navigation handled client-side
4. Fallback to server-side if JavaScript fails

## Content Security

### MIME Type Enforcement
- `.html` files: `text/html; charset=utf-8`
- `.css` files: `text/css; charset=utf-8`
- `.js` files: `application/javascript; charset=utf-8`
- `.pdf` files: `application/pdf`

### Security Headers
```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
```

## Error Handling

### File System Errors
- **File Not Found**: Return 404 with user-friendly page
- **Permission Denied**: Log error, return 500
- **Disk Space**: Log error, return 503

### Malformed Requests
- **Invalid Paths**: Sanitize and resolve or return 404
- **Path Traversal**: Block and log security attempt
- **Overlong URLs**: Return 414 URL Too Long