const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const _ = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// Load config for HMR
const parts = require('./webpack.parts');

const PATHS = {
    root: path.resolve(__dirname),
    app: path.resolve(__dirname, 'app'),
    imgs: path.resolve(__dirname, 'imgs'),
    entry: path.resolve(__dirname, 'app/app'),
    build: path.resolve(__dirname, 'build'),
    translations: path.resolve(__dirname, 'app/translation'),
    additions: {
        ga: './include/analytics/google/ga.js',
    },
};

const buildCfg = require('./buildCfg.js');
const TIMESTAMP = Date.now();

module.exports = function (env) {
    env && _.values(buildCfg.ENVS).indexOf(env) !== -1 || (env = 'development');

    const VERSION = buildCfg.APP_VERSION;
    const MAIN_MODULE_NAME = buildCfg.ANGULAR.MAIN_MODULE_NAME;
    const IS_ENV_PROD = env === buildCfg.ENVS.PROD;
    const IS_ENV_QA = env === buildCfg.ENVS.QA;
    const IS_ENV_DEV = env === buildCfg.ENVS.DEV;
    const IS_ENV_LOCAL = !env || env === buildCfg.ENVS.LOCAL;

    const API_URL = buildCfg.API_URL[env];
    const GOOGLE_ANALYTICS_ID = buildCfg.GOOGLE.ANALYTICS_ID[env];
    const GOOGLE_API_KEY = buildCfg.GOOGLE.API_KEY[env];

    const fileNameScheme = !IS_ENV_LOCAL ? '[name].[chunkhash]' : '[name]';
    const imagesNameScheme = !IS_ENV_LOCAL ? '[name].[hash]' : '[name]';

    const common = merge(
        {
            context: path.resolve(__dirname),
            entry: {
                app: PATHS.entry,
            },
            output: {
                path: PATHS.build,
                filename: `${fileNameScheme}.js`,
            },
            module: {
                rules: [
                    {
                        test: /\.js$/,
                        include: PATHS.app,
                        exclude: /node_modules/,
                        use: [
                            'ng-annotate-loader',
                            {
                                loader: 'babel-loader',
                                options: {
                                    cacheDirectory: true,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.html$/,
                        loader: 'underscore-template-loader',
                        options: {
                            root: PATHS.root,
                        },
                    },
                    {
                        test: /\.scss$/,
                        include: PATHS.app,
                        use: [
                            'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    root: PATHS.root,
                                },
                            },
                            'postcss-loader',
                            'sass-loader',
                        ],
                    },
                ],
            },
            plugins: [
                new HtmlWebpackPlugin({
                    title: buildCfg.ANGULAR.MAIN_MODULE_NAME,
                    filename: 'index.html',
                    template: './tpl/index.html',
                    inject: 'body',
                    minify: IS_ENV_PROD ? {
                        removeComments: true,
                        collapseWhitespace: true,
                    } : false,
                    favicon: 'imgs/favicon.ico',
                }),
                new webpack.DefinePlugin({
                    BUILD: {
                        VERSION: JSON.stringify(VERSION),
                        IS_ENV_PROD,
                        IS_ENV_QA,
                        IS_ENV_DEV,
                        IS_ENV_LOCAL,
                        API_URL: JSON.stringify(API_URL),
                        GOOGLE_ANALYTICS_ID: JSON.stringify(GOOGLE_ANALYTICS_ID),
                        GOOGLE_API_KEY: JSON.stringify(GOOGLE_API_KEY),
                        MAIN_MODULE_NAME: JSON.stringify(MAIN_MODULE_NAME),
                        TIMESTAMP: JSON.stringify(TIMESTAMP),
                    },
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    minChunks: function minChunks (module) {
                        return module.context && module.context.indexOf('node_modules') !== -1;
                    },
                }),
            ],
        }
    );

    if (IS_ENV_PROD) {
        return merge(
            common,
            parts.clean(PATHS.build),
            parts.imgsMinified(imagesNameScheme),
            parts.minifyJavaScript({ useSourceMap: false }),
            parts.extractCSS(PATHS),
            parts.copyJSON(PATHS.translations, TIMESTAMP),
            parts.moveVendors(),
            parts.banner(buildCfg)
        );
    } else if (IS_ENV_QA || IS_ENV_DEV) {
        return merge(
            common,
            parts.clean(PATHS.build),
            parts.imgsMinified(imagesNameScheme),
            parts.minifyJavaScript({ useSourceMap: true }),
            parts.generateSourcemaps('cheap-module-eval-source-map'),
            parts.extractCSS(PATHS),
            parts.copyJSON(PATHS.translations, TIMESTAMP),
            parts.moveVendors(),
            parts.banner(buildCfg)
        );
    }

    return merge(
        common,
        parts.imgs(imagesNameScheme),
        {
            performance: {
                hints: false,
            },
        },
        parts.generateSourcemaps('cheap-module-eval-source-map'),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT,
        })
        // ,parts.analyzer()
    );
};
