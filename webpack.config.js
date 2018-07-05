const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    target: 'node',
    entry: {
      app:'./index.js'
    } ,
    plugins: [
        new CleanWebpackPlugin(['npm_dist']),
        new CopyWebpackPlugin([
            './package.json',
            './README.md'
        ])

    ],
    output: {
        filename: 'index.js',
        path:path.join(__dirname,'npm_dist'),
        libraryTarget: 'umd'
    },
};