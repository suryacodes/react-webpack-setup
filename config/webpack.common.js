const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
    entry: path.resolve(__dirname, '..', 'src', 'index.tsx'),
    output: {
        path: path.resolve(__dirname, '..', 'dist'),
        filename: 'js/[name].[contenthash].js',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ['babel-loader'],
            },
            {
                test: /\.(s[ac]ss|css)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
                include: path.resolve(__dirname, '..', 'src'),
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'assets/image/[name].[ext]',
                        }
                    }],
            },
            {
                test: /\.(woff|woff2|eot|tmtf|otf)$/,
                use: ['file-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, '..', 'src', 'index.html'),
        }),

        new MiniCssExtractPlugin({
            filename: 'css/style.[contenthash].css'
        }),
    ],
};
