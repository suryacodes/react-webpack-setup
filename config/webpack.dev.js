const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const path = require('path');

module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        static: {
            directory: path.resolve(__dirname, '..', 'dist')
        },
        port: 8000,
        compress: true,
        hot: true,
    },
    plugins: [
        new ReactRefreshWebpackPlugin(),
        // new BundleAnalyzerPlugin()
    ]
};
