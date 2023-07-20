const path = require('path');

module.exports = {
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