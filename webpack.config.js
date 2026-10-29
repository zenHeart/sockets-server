const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    target: 'node',
    entry: {
      app:'./index.js'
    } ,
    plugins: [
        new CopyWebpackPlugin({ patterns: [
            { from: './package.json' },
            { from: './README.md' }
        ] })

    ],
    output: {
        filename: 'index.js',
        path:path.join(__dirname,'npm_dist'),
        clean: true,
        libraryTarget: 'umd'
    },
};
