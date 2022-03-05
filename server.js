const express = require('express');
const path = require('path');
const app = express();

STATIC_DIR = path.resolve(__dirname)
INDEX_PATH = path.resolve(__dirname, 'index.html')

app.use(express.static(STATIC_DIR));
app.get('/*', (req, res) => {
    res.sendFile(INDEX_PATH);
});

const port = process.env.PORT || 80;

app.listen(port, function () {
    console.log('Server listening port: ' + port);
});
