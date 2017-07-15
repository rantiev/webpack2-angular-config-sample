const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');

module.exports = {
    devServer,
    processCSS,
    extractHTML,
    minifyJavaScript,
    generateSourcemaps,
    clean,
    moveVendors,
    banner,
    analyzer,
    dashboard,
    json,
    extractJSON,
    copyJSON,
    imgs,
    imgsMinified,
};

function devServer (options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,

            // Unlike the cli flag, this doesn't set
            // HotModuleReplacementPlugin!
            hot: false,

            // Don't refresh if hot loading fails. If you want
            // refresh behavior, set inline: true instead.
            hotOnly: false,

            // Display only errors to reduce the amount of output.
            stats: 'errors-only',

            // Parse host and port from env to allow customization.
            //
            // If you use Vagrant or Cloud9, set
            // host: options.host || '0.0.0.0';
            //
            // 0.0.0.0 is available to all network devices
            // unlike default `localhost`.
            host: options.host, // Defaults to `localhost`
            port: options.port, // Defaults to 8080
        },
        plugins: [
            // Enable multi-pass compilation for enhanced performance
            // in larger projects. Good default.
           /* new webpack.HotModuleReplacementPlugin({
                // Disabled as this won't work with html-webpack-template yet
                multiStep: true
            }),*/
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, 'node_modules'),
            ]),
        ],
    };
}

function processCSS (paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: paths.app,
                    /* use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: [
                                {
                                    loader: 'css-loader',
                                    options: {
                                        root: paths.root,
                                    },
                                },
                                'postcss-loader',
                                'sass-loader',
                            ],
                        },
                    ),*/
                    use: [
                        'style-loader',
                        {
                            loader: 'css-loader',
                            options: {
                                root: paths.root,
                            },
                        },
                        'postcss-loader',
                        'sass-loader',
                    ],
                },
                {
                    test: /\.css$/,
                    include: paths.node_modules,
                    use: [
                        'style-loader',
                        'css-loader',
                    ],
                },
            ],
        },
        /*plugins: [
            new ExtractTextPlugin({
                filename: '[name].[chunkhash].css',
                disable: false,
                allChunks: true,
            }),
        ],*/
    };
}

function extractHTML (paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.html/,
                    include: paths.app,
                    use: ExtractTextPlugin.extract({ use: 'html-loader' }),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].[chunkhash].html',
                disable: false,
                allChunks: true,
            }),
        ],
    };
}

function minifyJavaScript ({ useSourceMap }) {
    return {
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                sourceMap: useSourceMap,
                // Don't beautify output (enable for neater output)
                beautify: false,
                // Eliminate comments
                comments: true,
                compress: {
                    warnings: true,
                    // Drop `console` statements
                    drop_console: false, // true is better
                },
            }),
        ],
    };
}

function generateSourcemaps (type) {
    return {
        devtool: type,
    };
}

function clean (path) {
    return {
        plugins: [
            new CleanWebpackPlugin(path),
        ],
    };
}

function moveVendors () {
    return {
        plugins: [
            new webpack.optimize.CommonsChunkPlugin({
                name: 'manifest',
            }),
            new webpack.HashedModuleIdsPlugin(),
            new WebpackChunkHash(),
            new ChunkManifestPlugin({
                filename: 'chunk-manifest.json',
                manifestVariable: 'webpackManifest',
            }),
        ],
    };
}

function banner (cfg) {
    return {
        plugins: [
            new webpack.BannerPlugin({
                banner: `${cfg.ANGULAR.MAIN_MODULE_NAME} ${cfg.APP_VERSION}`,
                entryOnly: true,
            }),
        ],
    };
}

function analyzer () {
    return {
        plugins: [
            new BundleAnalyzerPlugin(),
        ],
    };
}

function dashboard () {
    return {
        plugins: [
            new DashboardPlugin(),
        ],
    };
}

function json () {
    return {
        module: {
            rules: [
                {
                    test: /\.json$/,
                    loader: 'json-loader?name=[path][name].[ext]',
                },
            ],
        },
    };
}

function extractJSON (path) {
    return {
        module: {
            rules: [
                {
                    test: /\.json/,
                    include: path,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'json-loader',
                            use: [
                                'json-loader',
                            ],
                        },
                    ),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[path][name].json',
                disable: false,
                allChunks: true,
            }),
        ],
    };
}

function copyJSON (path, timestamp) {
    return {
        plugins: [
            new CopyWebpackPlugin([{
                from: path,
                to: `translation/[name].${timestamp}.[ext]`,
            }]),
        ],
    };
}

function imgs (root, imagesNameScheme) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png)$/,
                    loader: `file-loader?name=[path]${imagesNameScheme}.[ext]`,
                    options: {
                        root,
                    },
                },
            ],
        },
    };
}

function imgsMinified (root, imagesNameScheme) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png)$/,
                    use: [
                        `file-loader?name=[path]${imagesNameScheme}.[ext]`,
                        {
                            loader: 'image-webpack-loader',
                            query: {
                                mozjpeg: {
                                    progressive: true,
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                optipng: {
                                    optimizationLevel: 4,
                                },
                                pngquant: {
                                    quality: 70,
                                },
                                root,
                            },
                        },
                    ],
                },
            ],
        },
    };
}
