const webpack = require('webpack');
const path = require('path');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
//const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

// We use this to config HMR for WDS
exports.devServer = function (options) {
    return {
        devServer: {
            // Enable history API fallback so HTML5 History API based
            // routing works. This is a good default that will come
            // in handy in more complicated setups.
            historyApiFallback: true,

            // Unlike the cli flag, this doesn't set
            // HotModuleReplacementPlugin!
            hot: true,

            // Don't refresh if hot loading fails. If you want
            // refresh behavior, set inline: true instead.
            hotOnly: true,

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
            port: options.port // Defaults to 8080
        },
        plugins: [
            // Enable multi-pass compilation for enhanced performance
            // in larger projects. Good default.
            new webpack.HotModuleReplacementPlugin({
                // Disabled as this won't work with html-webpack-template yet
                multiStep: true
            }),
            new webpack.WatchIgnorePlugin([
                path.join(__dirname, 'node_modules')
            ])
        ]
    };
};

// We use this for linting CSS/SCSS/SASS + PostCSS
exports.lintCSS = function (paths) {
    return {
        module: {
            rules: [{
                test: /\.scss$/,
                include: paths,
                use: 'postcss-loader',
                enforce: 'pre'
            }]
        }
    };
};

// We use this for loading CSS/SCSS/SASS + PostCSS
exports.loadCSS = function (paths) {
    return {
        module: {
            rules: [{
                test: /\.scss$/,
                include: paths,
                use: [
                    'style-loader',
                    'css-loader',
                    'postcss-loader',
                    'sass-loader'
                ]
            }]
        }
    };
};

// We use this for extracting CSS
exports.extractCSS = function (paths) {
    return {
        module: {
            rules: [{
                test: /\.scss$/,
                include: paths,
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [
                        { loader: 'css-loader', query: {sourceMap: true} },
                        { loader: 'postcss-loader' },
                        { loader: 'sass-loader' }
                    ]
                })
            }]
        },
        plugins: [
            new ExtractTextPlugin({
                filename: '[chunkhash].[name].css',
                disable: false,
                allChunks: true
            })
        ]
    };
};

/*// We use this for purifying CSS
exports.purifyCSS = function (paths) {
    paths = Array.isArray(paths) ? paths : [paths];

    return {
        plugins: [
            new PurifyCSSPlugin({
                // Our paths are absolute so Purify needs patching
                // against that to work.
                basePath: '/',

                // `paths` is used to point PurifyCSS to files not
                // visible to Webpack. This expects glob patterns so
                // we adapt here.
                paths: paths.map(path => `${path}`),

                // Walk through only html files within node_modules. It
                // picks up .js files by default!
                resolveExtensions: ['.html']
            })
        ]
    };
};*/

// Load JS
exports.loadJS = function (paths) {
    return {
        module: {
            rules: [{
                test: /\.js$/,
                include: paths,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    // Enable caching for improved performance during
                    // development.
                    // It uses default OS directory by default. If you need
                    // something more custom, pass a path to it.
                    // I.e., { cacheDirectory: '<path>' }
                    cacheDirectory: true
                }
            }]
        }
    };
};

// TODO: Add eslint parse JS
exports.lintJS = function (paths) {

};

// Minify JS
exports.minifyJavaScript = function ({useSourceMap}) {
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
                    drop_console: false // true is better
                }
            })
        ]
    };
};

// Enable Sourcemaps
exports.generateSourcemaps = function (type) {
    return {
        devtool: type
    };
};

// Clean build
exports.clean = function (path) {
    return {
        plugins: [
            new CleanWebpackPlugin(path)
        ]
    };
};

// Create Chunk Bundles FIX - // http://survivejs.com/webpack/building-with-webpack/splitting-bundles/
exports.extractBundles = function (bundles, options) {
    const entry = {};
    const names = [];

    // Set up entries and names.
    bundles.forEach(({
        name,
        entries
    }) => {
        if (entries) {
            entry[name] = entries;
        }

        names.push(name);
    });

    return {
        // Define an entry point needed for splitting.
        entry,
        plugins: [
            // Extract bundles.
            new webpack.optimize.CommonsChunkPlugin(
                Object.assign({}, options, {
                    names
                })
            )
        ]
    };
};
