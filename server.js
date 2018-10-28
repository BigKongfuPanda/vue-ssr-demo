const server = require('express')();
const fs = require('fs');
const {createBundleRenderer} = require('vue-server-renderer');

const serverBundle = '';
const clientManifest = '';
const renderer = createBundleRenderer(serverBundle, {
    runInNewContext: false, // 推荐
    template: fs.readFileSync('./index.template.html', 'utf-8'),
    clientManifest: clientManifest //（可选）客户端构建 manifest
})

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