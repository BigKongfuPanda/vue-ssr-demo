const merge = require('webpack-merge');
const nodeExternals = require('webpack-node-externals');
const baseConfig = require('./webpack.base.conf.js');
const vueSSRServerPlugin = require('vue-server-renderer/server-plugin');

