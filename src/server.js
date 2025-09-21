const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.pathname;

    let accept = request.headers.accept || 'application/json';

    if (path === '/' || path === '/client.html') {
        fs.readFile('index.html', (error, data) => {
            if (error) {
                response.writeHead(500, { 'Content-Type': 'text/plain' });
                response.end('Server error');
                return;
            }
            response.writeHead(200, { 'Content-Type': 'text/html' });
            response.end(data);
        });
        return;
    }

    else if (path === 'style.css') {
        fs.readFile('style.css', (error, data) => {
            if (error) {
                response.writeHead(404, { 'Content-Type': 'text/plain' });
                response.end('Not found');
                return;
            }

            response.writeHead(200, { 'Content-Type': 'text/css' });
            response.end(data);
        });
        return;
    }

    else if (path === '/success') {
        if (accept.includes('text/xml')) {
            response.writeHead(statusCode, { 'Content-Type': 'text/xml' });
            response.end(`<response><message>This request was a success</message></response>`)
        }

        else {
            response.writeHead(200, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({message: "This request was a success"}));
        }
    }

    else if (path === '/badRequest') {
        if (accept.includes('text/xml')) {
            response.writeHead(statusCode, { 'Content-Type': 'text/xml' });
            response.end(`<response><message>Missing valid query parameter</message><id>badRequest</id></response>`);
        }

        else {
            response.writeHead(400, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                message: "Missing valid query parameter",
                id: "badRequest"
            }));
        }
    }

    else if (path === '/unauthorized') {
        if (accept.includes('text/xml')) {
            response.writeHead(statusCode, { 'Content-Type': 'text/xml' });
            response.end(`<response><message>Request was unauthorized</message><id>unauthorized</id></response>`);
        }

        else {
            response.writeHead(401, { 'Content-Type': 'application/json' });
            response.end(JSON.stringify({
                message: "Request was unauthorized",
                id: "unauthorized"
            }))
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});