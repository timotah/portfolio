const http = require("http");
const fs = require("fs");
const path = require("path");

const server = http.createServer((req, res) => {
    // Get the file path for the requested URL
    const filePath = path.join(__dirname, "index.html");

    // Read the content of the file
    fs.readFile(filePath, "utf8", (err, content) => {
        // to send 404
        // If an error occurs, send a 500 Internal Server Error response
        res.writeHead(500, { "Content-Type": "text/html" });
        res.end(
            `<head> <title>My Website</title> <style> *, html { margin: 0; padding: 0; border: 0; } html { width: 100%; height: 100%; } body { width: 100%; height: 100%; position: relative; background-color: rgb(236, 152, 42); } .center { width: 100%; height: 50%; margin: 0; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-family: "Trebuchet MS", Helvetica, sans-serif; text-align: center; } h1 { font-size: 144px; } p { font-size: 64px; } </style> </head> <body> <div class="center"> <h1>404<h1> <p>Internal Server Error</p> </div> </body> </html>`
        );

        // console.log(req.url);

        // // Set the response header
        // res.writeHead(200, { "Content-Type": "text/html" });
        // // res.writeHead(200, { "Content-Type": "text/css" });

        // // Send the HTML content as the response
        // res.end(content);
    });
});

// Set the port number for the server to listen on
const port = 8080;

// Start the server and listen on the specified port
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
