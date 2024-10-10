const http = require("http");
const fs = require("fs");
const path = require("path");
const express = require("express");
const browserSync = require("browser-sync").create();  // Correctly initialize browser-sync

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.get("/*", (req, res) => {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the server and listen on the specified port
const server = app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});

// Initialize BrowserSync
// browserSync.init({
//         proxy: `http://localhost:${port}`,
//         files: ["public/**/*.*"],  // Watch all files in the public directory
//         port: 3001,
//         open: false
//     });