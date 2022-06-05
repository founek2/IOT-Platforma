const prod = process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    mode: prod ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
        path: __dirname + '/build/',
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx', '.js', '.json'],
                },
                use: 'ts-loader',
            },
            // {
            //     test: /\.(js|jsx)$/,
            //     exclude: /node_modules/,
            //     use: ['babel-loader'],
            // },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    devtool: prod ? undefined : 'source-map',
    plugins: [
        new HtmlWebpackPlugin({
            template: __dirname + '/public/index.html',
        }),
        new MiniCssExtractPlugin(),
    ],
};
