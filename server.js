const createApp = require('./app');
const server = require('express')();
const fs = require('fs');
const renderer = require('vue-server-renderer').createRenderer({
    template: fs.readFileSync('./index.template.html', 'utf-8')
});

server.get('*', (req, res) => {
    const context = {
        title: 'vue服务端渲染',
        url: req.url
    };
    const app = createApp(context);

    renderer.renderToString(app, context, (err, html) => {
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