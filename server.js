fs = require("fs");
http = require('http');
https = require('https');
express = require('express');
path = require('path');
proxy = require('express-http-proxy');
app = express();

ROOT_DIR = __dirname;

PRIVATE_KEY_PATH = 'ssl/server.key';
PUBLIC_KEY_PATH = 'ssl/server.crt';

DEFAULT_STATIC_PATH = 'static/default_static';
SITE_CONFIGS = {
    squest: {
        apiPath: '/api',
        apiRedirectUrl: 'http://127.0.0.1:9000/api',

        staticDir: 'static/squest',
        indexHtml: 'index.html',
        SPA: true,

        httpsOnly: true,
    },
    fnews: {
        apiPath: '/api',
        apiRedirectUrl: 'http://example.com/api',

        staticDir: 'static/fnews',
        indexHtml: 'index.html',
        SPA: true,
    },
}


for (const [name, config] of Object.entries(SITE_CONFIGS)) {
    // api requests
    app.use(`/${name}${config.apiPath}`, proxy(config.apiRedirectUrl));

    // only http redirect
    app.get(`/${name}/*`, (req, res, next) => {
        const host = req.get('Host');
        if (config.httpsOnly && (host !== '127.0.0.1') && (host !== 'localhost')) {
            if (req.headers['x-forwarded-proto'] !== 'https') {
                console.log("HTTPS redirect on ", host + req.url)
                res.redirect('https://' + host + req.url)
                return;
            }
        }
        next();
    });

    // path files requests
    app.use(`/${name}`, express.static(config.staticDir));

    // another path requests -> resolve to index.html
    app.get(`/${name}/*`, (req, res) => {
        if (config.SPA) {
            console.log(req.path, `send "${name}" index.html`);
            res.sendFile(path.resolve(ROOT_DIR, config.staticDir, config.indexHtml || 'index.html'));
            return;
        }
        res.sendFile(path.resolve(ROOT_DIR, config.staticDir, req.params.path));
    });
}

app.use(`/`, express.static(DEFAULT_STATIC_PATH));

//The 404 route with global index.html
app.get('*', function(req, res){
    res.status(404).sendFile(path.resolve(ROOT_DIR, DEFAULT_STATIC_PATH, 'index.html'));
});


const HTTP_PORT = process.env.PORT || 80;
const HTTPS_PORT = process.env.PORT || 443;

// const privateKey = fs.readFileSync(PRIVATE_KEY_PATH);
// const certificate = fs.readFileSync(PUBLIC_KEY_PATH);
//
// const httpServer = http.createServer(app);
// const httpsServer = https.createServer({
//     key: privateKey,
//     cert: certificate
// }, app);

/*httpServer.listen(HTTP_PORT, 'localhost', () => {
    console.log(`http server started at :${HTTP_PORT}`);
});
httpsServer.listen(HTTPS_PORT, () => {
    console.log(`https server started at :${HTTPS_PORT}`);
});*/

app.listen(HTTP_PORT, () => {
    console.log('Server working on http://localhost:' + HTTP_PORT);
});
