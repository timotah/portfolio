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

app.get("*", (req, res) => {
  if (!req.path.includes(".")) {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  } else {
    res.status(404).send("File not found");
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
