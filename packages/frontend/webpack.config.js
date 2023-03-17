const isEnvProduction = process.env.NODE_ENV === 'production';
const sourceMapEnv = process.env.SOURCE_MAP;

const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ReactRefreshTypeScript = require('react-refresh-typescript');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const proxyTarget =
    process.env.PROXY === 'dev'
        ? 'https://dev.iotdomu.cz'
        : process.env.PROXY === 'prod'
        ? 'https://iotdomu.cz'
        : 'http://localhost:8085';

console.log('Proxy target: ', proxyTarget, process.env.NODE_ENV);
const config = {
    mode: isEnvProduction ? 'production' : 'development',
    entry: ['./src/index.tsx'],
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: isEnvProduction ? 'assets/js/[name].[contenthash:8].js' : 'static/js/[name].js',
        chunkFilename: isEnvProduction ? 'assets/js/[name].[contenthash:8].chunk.js' : 'static/js/[name].chunk.js',
        assetModuleFilename: 'assets/media/[name].[hash][ext]',
        publicPath: '/',
        clean: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        fallback: {
            stream: require.resolve('stream-browserify'),
            process: require.resolve('process'),
            'process/browser': require.resolve('process/browser'),
        },
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
                    getCustomTransformers: () => ({
                        before: [!isEnvProduction && ReactRefreshTypeScript()].filter(Boolean),
                    }),
                    projectReferences: true,
                },
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
                // use: {
                //     loader: MiniCssExtractPlugin.loader,
                // },
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
        ],
    },
    devtool: sourceMapEnv ? sourceMapEnv : isEnvProduction ? undefined : 'inline-source-map',
    // devtool: 'source-map',
    plugins: [
        !isEnvProduction && new ReactRefreshWebpackPlugin(),
        !isEnvProduction &&
            new ForkTsCheckerWebpackPlugin({
                typescript: {
                    mode: 'write-references',
                    build: true,
                },
            }),
        new CopyPlugin({
            patterns: [
                { from: path.join(__dirname, 'public/assets'), to: 'assets' },
                {
                    from: 'public/*.js',
                    to() {
                        return '[name][ext]';
                    },
                },
                {
                    from: 'public/*.png',
                    to() {
                        return '[name][ext]';
                    },
                },
                'public/robots.txt',
                'public/iotdomu.webmanifest',
            ],
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'public/index.html'),
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/css/[name].[contenthash:8].css',
            chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
        }),
        new webpack.EnvironmentPlugin({ ...process.env }),
        new webpack.ProvidePlugin({
            process: 'process/browser',
        }),
        !isEnvProduction && new webpack.HotModuleReplacementPlugin(),
        isEnvProduction &&
            new WorkboxPlugin.InjectManifest({
                swSrc: './src/service-worker.ts',
                swDest: 'service-worker.js',
                maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
                exclude: [/\.map$/, /^manifest.*\.js$/, /\/dist\//],
            }),
    ].filter(Boolean),
    devServer: {
        proxy: {
            '/api': {
                target: 'http://localhost:3000',
                router: () => proxyTarget,
                // router: () => 'https://dev.iotdomu.cz',
                // logLevel: 'debug' /*optional*/,
                changeOrigin: true,
            },
            '/socket.io': {
                target: 'http://localhost:3000',
                router: () => proxyTarget,
                ws: true,
                changeOrigin: true,
            },
            // '/api': 'https://iotdomu.cz',
        },
        historyApiFallback: {
            rewrites: [{ from: /^\/(?!api\/)/, to: '/index.html' }],
        },
    },
    // optimization: {
    //     splitChunks: {
    //         chunks: 'all',
    //         cacheGroups: {
    //             reactVendor: {
    //                 test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/,
    //                 name: 'vendor-react',
    //                 chunks: 'all',
    //             },
    //         },
    //     },
    // },

    optimization: {
        splitChunks: {
            chunks: 'async',
            minSize: 20000,
            minRemainingSize: 0,
            minChunks: 1,
            maxAsyncRequests: 30,
            maxInitialRequests: 30,
            enforceSizeThreshold: 50000,
            cacheGroups: {
                reactVendor: {
                    test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|@reduxjs|ramda)[\\/]/,
                    name: 'vendor',
                    chunks: 'all',
                },

                // default: {
                //     minChunks: 2,
                //     priority: -20,
                //     reuseExistingChunk: true,
                // },
            },
        },
    },
};

module.exports = config;
