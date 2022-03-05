var express = require('express');
var app = express();
var path = require('path');
app.use(express.static(path.join(process.cwd(), 'source')));

const PORT = process.env.PORT || 80
app.listen(PORT, 'localhost', () => {
    console.log("Server listening on port: " + PORT);
});
