const express = require('express');
const fs = require('fs');
const path = require('path');
const {createBundleRenderer} = require('vue-server-renderer');
const resolve = file => path.resolve(__dirname, file);
const server = express();

const serverBundle = require('./dist/vue-ssr-server-bundle.json');
const clientManifest = require('./dist//vue-ssr-client-manifest.json');
const template = fs.readFileSync(resolve('./index.template.html'), 'utf-8');
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template: template,
    clientManifest: clientManifest, //（可选）客户端构建 manifest
    basedir: resolve('./dist')
})

server.use(express.static(path.join(__dirname, 'dist')));

server.get('*', (req, res) => {
    const context = {
        title: 'vue服务端渲染',
        url: req.url
    };

    renderer.renderToString(context, (err, html) => {
        if (err) {
            res.status(500).end('Internal Server Error');
            return;
        }
        res.end(html);
    });
});

server.listen(8888, () => {
    console.log('server start at: localhost:8888');
});