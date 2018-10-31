const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.conf.js');
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin');
// 去除打包css的配置
baseConfig.module.rules[1].options = '';

module.exports = merge(baseConfig, {
    entry: './src/entry-server.js',
    target: 'node',
    devtool: 'source-map',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: nodeExternals({
        whitelist: /\.css$/
    }),
    // 这是将服务器的整个输出
    // 构建为单个 JSON 文件的插件。
    // 默认文件名为 `vue-ssr-server-bundle.json`
    plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.VUE_ENV': '"server"'
        }),
        new VueSSRServerPlugin()
    ]
})