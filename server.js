express = require('express');
path = require('path');
proxy = require('express-http-proxy');
app = express();

ROOT_DIR = __dirname;

SITE_CONFIGS = {
    squest: {
        apiPath: '/api',
        apiRedirectUrl: 'http://squest-api.herokuapp.com/api',

        staticDir: 'squest',
        indexHtml: 'index.html',
        SPA: true,
    },
    fnews: {
        apiPath: '/api',
        apiRedirectUrl: 'http://example.com/api',

        staticDir: 'fnews',
        indexHtml: 'index.html',
        SPA: true,
    },
}


for (const [name, config] of Object.entries(SITE_CONFIGS)) {
    // api requests
    app.use(`/${name}${config.apiPath}`, proxy(config.apiRedirectUrl));

    // path files requests
    app.use(`/${name}`, express.static(config.staticDir));

    // another path requests -> resolve to index.html
    app.get(`/${name}/:path`, (req, res) => {
        if (config.SPA) {
            console.log(req.path, "send index.html");
            res.sendFile(path.resolve(ROOT_DIR, config.staticDir, config.indexHtml || 'index.html'));
            return;
        }
        res.sendFile(path.resolve(ROOT_DIR, config.staticDir, req.params.path));
    });
}


const port = process.env.PORT || 80;
app.listen(port, function () {
    console.log('Server listening port: ' + port);
});
