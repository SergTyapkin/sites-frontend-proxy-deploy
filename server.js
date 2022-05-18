express = require('express');
path = require('path');
proxy = require('express-http-proxy');
app = express();

ROOT_DIR = __dirname;

MAP_APIS = {
    squest: {
        apiUrl: 'http://squest-api.herokuapp.com/api',
        staticDir: 'static',
    },
    fnews: {
        apiUrl: 'http://example.com/api',
        staticDir: 'static',
    },
}


app.use('/:site/api', (req, res) => {
    const site = req.params.site;
    const siteConfig = MAP_APIS[site];
    return proxy(siteConfig.apiUrl);
}

for (const site of Object.keys(MAP_APIS))
    app.use('/' + site, express.static(STATIC_DIR));

app.get('/:site/*', (req, res) => {
    const site = req.params.site;
    const siteConfig = MAP_APIS[site];
    const indexPath = siteConfig.indexPath || 'index.html':
    res.sendFile(path.resolve(ROOT_DIR, site, siteConfig.staticDir, INDEX_PATH);
});


const port = process.env.PORT || 80;
app.listen(port, function () {
    console.log('Server listening port: ' + port);
});
