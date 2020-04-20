const path = require('path');

module.exports = {
    module: {
        rules: [
            { test: /\.glsl$/, use: 'webpack-glsl-loader' },
        ]
    },
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        contentBase: './dist',
    },
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
    }
};
