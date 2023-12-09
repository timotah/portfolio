"use strict";
const http = require("http");
const Router = require("./router");

const routes = [
    { path: "/", callback: () => console.log("Home page") },
    { path: "/projects", callback: () => console.log("Projects page") },
];

// const router = new Router(routes);

const portNumber = 8080;

// Create a server instance
const server = http.createServer((req, res) => {
    // Write a response to the client
    res.write("Response from server");
    res.statusCode = 200;

    // End the response
    res.end();
});

// Setup the server to listen on port 8080
server.listen(portNumber, () => {
    console.log("Server is listening on port " + portNumber);
});
