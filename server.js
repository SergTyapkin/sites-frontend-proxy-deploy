const express = require('express');
const path = require('path');
const proxy = require("express-http-proxy");
const app = express();

const
    STATIC_DIR = path.resolve(__dirname);
    INDEX_PATH = path.resolve(__dirname, 'index.html');
    API_URL = 'http://squest-api.herokuapp.com/api';

app.use('/api', proxy(API_URL));

app.use(express.static(STATIC_DIR));
app.get('/*', (req, res) => {
    res.sendFile(INDEX_PATH);
});

const port = process.env.PORT || 80;

app.listen(port, function () {
    console.log('Server listening port: ' + port);
});
