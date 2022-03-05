const express = require('express');
const app = express();

app.use(express.static(__dirname));

const port = process.env.PORT || 80;

app.listen(port, function () {
    console.log(`Server listening port ${port}`);
});
