// const http = require("http");
// const fs = require("fs");
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Serve static assets from dist directory
app.use(express.static(path.join(__dirname, "dist")));

// Serve additional static assets
app.use("/static", express.static(path.join(__dirname, "static")));

// Route mapping for static HTML fallback
const staticRoutes = {
  '/': 'home',
  '/home': 'home', 
  '/projects': 'projects',
  '/contact': 'contact',
  '/resume': 'aboutme',
  '/learning': 'learning'
};

app.get("*", (req, res) => {
  // Handle file requests (assets, etc.)
  if (req.path.includes(".")) {
    res.status(404).send("File not found");
    return;
  }
  
  // Check if this is a request for a known route
  const routeName = staticRoutes[req.path];
  
  if (routeName) {
    // Check if JavaScript is likely disabled by looking at Accept header
    // If request accepts text/html and doesn't indicate XHR, serve static HTML
    const acceptsHtml = req.headers.accept && req.headers.accept.includes('text/html');
    const isXhr = req.headers['x-requested-with'] === 'XMLHttpRequest';
    const hasJsHint = req.headers['x-spa-enabled'] === 'true';
    
    // If this looks like a browser navigation (not XHR) and no JS hint, serve static HTML
    if (acceptsHtml && !isXhr && !hasJsHint) {
      const staticHtmlPath = path.join(__dirname, 'src', 'pages', routeName, `${routeName}.html`);
      
      // Check if static HTML exists
      try {
        res.sendFile(staticHtmlPath);
        return;
      } catch (error) {
        // If static HTML doesn't exist, fall back to SPA
        console.log(`Static HTML not found for ${routeName}, falling back to SPA`);
      }
    }
  }
  
  // Default: serve SPA index.html (JavaScript enabled or unknown route)
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
