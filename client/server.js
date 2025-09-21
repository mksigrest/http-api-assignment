const http = require('http');
const fs = require('fs');
const url = require('url');

const PORT = 3000;

const responseJSON = (response, statusCode, object) => {
    response.writeHead(statusCode, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify(object));
};

const responseXML = (response, statusCode, xmlString) => {
    response.writeHead(statusCode, { 'Content-Type': 'text/xml' });
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
            responseXML(response, 200, `<response><message>This is a successful response.</message></response>`);
        }

        else {
            responseJSON(response, 200, { message: "This is a successful response." });
        }
        return;
    }

    else if (path === '/badRequest') {
        if (accept.includes('text/xml')) {
            responseXML(response, 400, `<response><message>Missing valid query parameter set to true.</message><id>badRequest</id></response>`);
        }

        else {
            responseJSON(response, 400, { message: "Missing valid query parameter set to true.", id: "badRequest" });
        }
        return;
    }

    else if (path === '/unauthorized') {
        if (accept.includes('text/xml')) {
            responseXML(response, 401, `<response><message>Missing loggedIn query parameter set to yes.</message><id>unauthorized</id></response>`);
        }

        else {
            responseJSON(response, 401, { message: "Missing loggedIn query parameter set to yes.", id: "unauthorized" })
        }
        return;
    }

    else if (path === '/forbidden') {
        if (accept.includes('text/xml')) {
            responseXML(response, 403, `<response><message>You do not have access to this content.</message><id>forbidden</id></response>`);
        }

        else {
            responseJSON(response, 403, { message: "You do not have access to this content.", id: "forbidden" })
        }
        return;
    }

    else if (path === '/internal') {
        if (accept.includes('text/xml')) {
            responseXML(response, 500, `<response><message>Internal server error. Something went wrong.</message><id>internalError</id></response>`);
        }

        else {
            responseJSON(response, 500, { message: "Internal server error. Something went wrong.", id: "internalError" })
        }
        return;
    }

    else if (path === '/notImplemented') {
        if (accept.includes('text/xml')) {
            responseXML(response, 501, `<response><message>A get request for this page has not been implemented yet. Check again later for updated content.</message><id>notImplimented</id></response>`);
        }

        else {
            responseJSON(response, 501, { message: "A get request for this page has not been implemented yet. Check again later for updated content.", id: "notImplimented" })
        }
        return;
    }

    else {
        if (accept.includes('text/xml')) {
            responseXML(response, 404, `<response><message>The page you are looking for was not found.</message><id>notFound</id></response>`);
        }

        else {
            responseJSON(response, 404, { message: "The page you are looking for was not found.", id: "notFound" })
        }
        return;
    }

});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});