const path = require('path');

const coreConfig = {
    target: 'web',
    mode: 'production',
    devServer: {
        open: true,
        port: 9000,
        static: {
            directory: path.join(__dirname),
            // path.join(__dirname),
            // path.join(__dirname, 'dist')
        },
        hot: true,
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

const appConfig = {
    target: 'web',
    mode: 'production',
    // devServer: {
    //     open: 'google-chrome',
    //     port: 9009,
    //     static: [
    //         path.join(__dirname),
    //         path.join(__dirname, 'dist')
    //     ],
    //     hot: true,
    //     liveReload: true,
    // },
    entry: path.resolve('./../../../../..', 'custom/apps/CustomApp/Resources/app/storefront/src/main.js'),
    output: {
        path: path.resolve('./../../../../..', 'custom/apps/CustomApp/Resources/app/storefront/dist'),
        filename: 'custom-app.js',
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
}

const threeJsAppConfig = {
    target: 'web',
    mode: 'production',
    // devServer: {
    //     open: 'google-chrome',
    //     port: 9008,
    //     static: [
    //         path.join(__dirname),
    //         path.join(__dirname, 'dist')
    //     ],
    //     hot: true,
    //     liveReload: true,
    // },
    entry: path.resolve('./../../../../..', 'custom/apps/ThreeJsApp/Resources/app/storefront/src/main.js'),
    output: {
        path: path.resolve('./../../../../..', 'custom/apps/ThreeJsApp/Resources/app/storefront/dist'),
        filename: 'three-js-app.js',
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
}

module.exports = [coreConfig, appConfig, threeJsAppConfig];

module.exports.parrallelism = 3;