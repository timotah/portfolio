// const http = require("http");
// const fs = require("fs");
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use('/static', express.static(path.join(__dirname, 'static')));

// Main section routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/home/home.html'));
});
app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/projects/projects.html'));
});
app.get('/aboutme', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/resume/resume.html'));
});
app.get('/learning', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/learning/learning.html'));
});
app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/pages/contact/contact.html'));
});

// Fallback for unknown routes (must be last)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/404.html'));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
