const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const responseJSON = (response, statusCode, object) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(object));
};

const responseXML = (response, statusCode, xmlString) => {
    response.writeHead(statusCode, { 'Content-Type ': 'text/xml' });
    response.end(xmlString);
}

const server = http.createServer((request, response) => {
    const parsedUrl = url.parse(request.url, true);
    const path = parsedUrl.pathname;
    const query = parsedUrl.query;

    let accept = request.headers.accept || 'application/json';

    if (path === '/' || path === '/client.html') {
        fs.readFile('client.html', (error, data) => {
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

    else if (path === '/style.css') {
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
            responseXML(response, 200, `<response><message>This request was a success</message></response>`);
        }

        else {
            responseJSON(response, 200, { message: "This request was a success" });
        }
        return;
    }

    else if (path === '/badRequest') {
        if (accept.includes('text/xml')) {
            responseXML(response, 400, `<response><message>Missing valid query parameter</message><id>badRequest</id></response>`);
        }

        else {
            responseJSON(response, 400, { message: "Missing valid query parameter", id: "badRequest" });
        }
        return;
    }

    else if (path === '/unauthorized') {
        if (accept.includes('text/xml')) {
            responseXML(response, 401, `<response><message>Request was unauthorized</message><id>unauthorized</id></response>`);
        }

        else {
            responseJSON(response, 401, { message: "Request was unauthorized", id: "unauthorized" })
        }
        return;
    }

    else if (path === '/forbidden') {
        if (accept.includes('text/xml')) {
            responseXML(response, 403, `<response><message>Forbidden</message><id>forbidden</id></response>`);
        }

        else {
            responseJSON(response, 403, { message: "Forbidden", id: "forbidden" })
        }
        return;
    }

    else if (path === '/internal') {
        if (accept.includes('text/xml')) {
            responseXML(response, 500, `<response><message>Internal server error</message><id>internal</id></response>`);
        }

        else {
            responseJSON(response, 500, { message: "Internal server error", id: "internal" })
        }
        return;
    }

    else if (path === '/internal') {
        if (accept.includes('text/xml')) {
            responseXML(response, 501, `<response><message>Not implimented</message><id>notImplimented</id></response>`);
        }

        else {
            responseJSON(response, 501, { message: "Not implimented", id: "notImplimented" })
        }
        return;
    }

    else {
        if (accept.includes('text/xml')) {
            responseXML(response, 404, `<response><message>Page not found</message><id>notFound</id></response>`);
        }

        else {
            responseJSON(response, 404, { message: "Page not found", id: "notFound" })
        }
        return;
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});