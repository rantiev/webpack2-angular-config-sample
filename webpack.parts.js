const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


// We use this to config HMR for WDS
module.exports.devServer = function (options) {
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
};

// We use this for extracting CSS
module.exports.extractCSS = function (paths) {
    return {
        module: {
            rules: [
                {
                    test: /\.scss$/,
                    include: paths.app,
                    use: ExtractTextPlugin.extract(
                        {
                            fallback: 'style-loader',
                            use: [
                                'css-loader',
                                'postcss-loader',
                                'sass-loader',
                            ],
                        }
                    ),
                },
            ],
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[name].[chunkhash].css',
                disable: false,
                allChunks: true,
            }),
        ],
    };
};

// Minify JS
module.exports.minifyJavaScript = function ({ useSourceMap }) {
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
};

// Enable Sourcemaps
module.exports.generateSourcemaps = function generateSourcemaps (type) {
    return {
        devtool: type,
    };
};

// Clean build
module.exports.clean = function clean (path) {
    return {
        plugins: [
            new CleanWebpackPlugin(path),
        ],
    };
};

module.exports.moveVendors = function moveVendors () {
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
};

module.exports.banner = function banner (cfg) {
    return {
        plugins: [
            new webpack.BannerPlugin({
                banner: cfg.ANGULAR.MAIN_MODULE_NAME + ' ' + cfg.APP_VERSION,
                entryOnly: true,
            }),
        ],
    };
};

module.exports.analyzer = function analyzer () {
    return {
        plugins: [
            new BundleAnalyzerPlugin(),
        ],
    };
};

module.exports.imgs = function imgs (imagesNameScheme) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png|svg)$/,
                    loader: `file-loader?name=[path]${imagesNameScheme}.[ext]`,
                },
            ],
        },
    };
};

module.exports.imgsMinified = function imgsMinified (imagesNameScheme) {
    return {
        module: {
            rules: [
                {
                    test: /\.(jpg|png|svg)$/,
                    use: [
                        `file-loader?name=[path]${imagesNameScheme}.[ext]`,
                        'image-webpack-loader?bypassOnDebug&optimizationLevel=7',
                    ],
                },
            ],
        },
        /*plugins: [
            new webpack.LoaderOptionsPlugin({
                options: {
                    imageWebpackLoader: {
                        mozjpeg: {
                            quality: 65,
                        },
                        pngquant: {
                            quality: '65-90',
                            speed: 4,
                        },
                        svgo: {
                            plugins: [
                                {
                                    removeViewBox: false,
                                },
                                {
                                    removeEmptyAttrs: false,
                                },
                            ],
                        },
                    },
                },
            }),
        ],*/
    };
};