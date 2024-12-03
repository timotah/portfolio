// const http = require("http");
// const fs = require("fs");
const path = require("path");
const express = require("express");

const port = 3000;

const app = express();

app.use(express.static(path.join(__dirname, "/public")));

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
