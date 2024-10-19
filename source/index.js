const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const mainPage = require('./main');
const subPage = require('./subpage');

const app = express();
app.use(mainPage);
app.use(subPage);

// Determine the mode (http, https, both) from the environment variable
const MODE = process.env.MODE || 'http';
const HTTP_PORT = process.env.HTTP_PORT || 80;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const SSL_KEY_PATH = process.env.SSL_KEY_PATH;
const SSL_CERT_PATH = process.env.SSL_CERT_PATH;

// If HTTPS mode or both, load the SSL certificates
let httpsOptions = {};
if (MODE === 'https' || MODE === 'both') {
    httpsOptions = {
        key: fs.readFileSync(SSL_KEY_PATH),
        cert: fs.readFileSync(SSL_CERT_PATH)
    };
}

// Start HTTP server if 'http' or 'both' mode is enabled
if (MODE === 'http' || MODE === 'both') {
    http.createServer(app).listen(HTTP_PORT, () => {
        console.log(`HTTP server running on port ${HTTP_PORT}`);
    });
}

// Start HTTPS server if 'https' or 'both' mode is enabled
if (MODE === 'https' || MODE === 'both') {
    https.createServer(httpsOptions, app).listen(HTTPS_PORT, () => {
        console.log(`HTTPS server running on port ${HTTPS_PORT}`);
    });
}
