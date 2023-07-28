const path = require('path');

module.exports = {
    target: 'web',
    mode: 'production',
    devServer: {
        open: 'google-chrome',
        port: 9000,
        contentBase: [
            path.join(__dirname),
            path.join(__dirname, 'dist')
        ],
        watchContentBase: true,
        liveReload: true,
    },
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'storefront.js',
        chunkFilename: '[name].js',
    },
    resolve: {
        modules: [
            path.resolve(__dirname, 'node_modules'),
        ],
        alias: {
            src: path.resolve(__dirname, 'src'),
        },
    },
};