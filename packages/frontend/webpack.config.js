const prod = process.env.NODE_ENV === 'production';

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

const config = {
    mode: prod ? 'production' : 'development',
    entry: './src/index.tsx',
    output: {
        path: __dirname + '/build/',
        publicPath: '/',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            stream: require.resolve('stream-browserify'),
        },
        plugins: [new TsconfigPathsPlugin({ configFile: './tsconfig.json' })],
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|jsx|js)$/,
                exclude: /node_modules/,
                resolve: {
                    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
                },
                loader: 'ts-loader',
                options: {
                    projectReferences: true,
                },
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
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': process.env.NODE_ENV,
        // }),
    ],
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                router: () => 'http://localhost:8085',
                // router: () => 'https://iotdomu.cz',
                // logLevel: 'debug' /*optional*/,
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                router: () => 'http://localhost:8085',
                // router: () => 'https://iotdomu.cz',
                ws: true,
                changeOrigin: true,
            },
            // '/api': 'https://iotdomu.cz',
        },
        historyApiFallback: {
            rewrites: [{ from: /^\/(?!api\/)/, to: '/index.html' }],
        },
    },
};

if (prod) {
    config.plugins.push(
        new WorkboxPlugin.InjectManifest({
            swSrc: './src/service-worker.ts',
            swDest: 'service-worker.js',
        })
    );
}

module.exports = config;
