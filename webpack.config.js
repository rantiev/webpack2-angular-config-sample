const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const _ = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin');

// Load config for HMR
const parts = require('./webpack.parts');

const PATHS = {
    entry: path.resolve(__dirname, 'app/app'),
    build: path.resolve(__dirname, 'build'),
    additions: {
        ga: './include/analytics/google/ga.js'
    }
};

const buildCfg = require('./buildCfg.js');

module.exports = function (env) {

    env && _.values(buildCfg.ENVS).indexOf(env) !== - 1 || (env = 'development');

    const VERSION = buildCfg.APP_VERSION;
    const MAIN_MODULE_NAME = buildCfg.ANGULAR.MAIN_MODULE_NAME;
    const IS_ENV_PROD = env === buildCfg.ENVS.PROD;
    const IS_ENV_QA = env === buildCfg.ENVS.QA;
    const IS_ENV_DEV = env === buildCfg.ENVS.DEV;
    const API_URL = buildCfg.API_URL[env];
    const GOOGLE_ANALYTICS_ID = buildCfg.GOOGLE.ANALYTICS_ID[env];
    const GOOGLE_API_KEY = buildCfg.GOOGLE.API_KEY[env];

    const common = merge(
        {
            entry: {
                app: PATHS.entry,
                vendor: [
                    'lodash'
                ]
            },
            output: {
                path: PATHS.build,
                filename: '[hash].[name].js'
            },
            module: {
                rules: [
                    {
                        test: /\.(jpg|png)$/,
                        loader: 'url-loader',
                        options: {
                            limit: 25000
                        }
                    },
                    {
                        // Better to use raw-loader for raw SVG
                        test: /\.svg$/,
                        use: 'file-loader'
                    },
                    {
                        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                        loader: 'url-loader',
                        options: {
                            name: 'fonts/[hash].[ext]',
                            limit: 5000,
                            mimetype: 'application/font-woff'
                        }
                    },
                    {
                        test: /\.ttf$|\.eot$/,
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[hash].[ext]'
                        }
                    },
                    {
                        test: /\.html$/,
                        loader: 'underscore-template-loader'
                    }
                ]
            },
            plugins: [
                new HtmlWebpackPlugin({
                    title: 'MY APP',
                    filename: 'index.html',
                    template: './tpl/index.html',
                    inject: 'body',
                    minify: IS_ENV_PROD ? {
                        removeComments: true,
                        collapseWhitespace: true
                    } : false,
                    favicon: 'imgs/favicon.ico',
                    analytics: false,
                    buildMode: 'prod'
                }),
                new webpack.DefinePlugin({
                    BUILD: {
                        VERSION: JSON.stringify(VERSION),
                        IS_ENV_PROD: IS_ENV_PROD,
                        IS_ENV_QA: IS_ENV_QA,
                        IS_ENV_DEV: IS_ENV_DEV,
                        API_URL: JSON.stringify(API_URL),
                        GOOGLE_ANALYTICS_ID: JSON.stringify(GOOGLE_ANALYTICS_ID),
                        GOOGLE_API_KEY: JSON.stringify(GOOGLE_API_KEY),
                        MAIN_MODULE_NAME: JSON.stringify(MAIN_MODULE_NAME)
                    }
                })
            ]
        }
    );

    if (env === 'production') {
        return merge(
            common,
            {
                plugins:
                [
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'app',
                        chunks: ['app'],
                        minChunks: isVendor,
                    }),
                    new webpack.optimize.CommonsChunkPlugin({
                        name: 'vendor',
                        minChunks: Infinity,
                    }),
                ]
            },
            parts.lintJS(),
            parts.lintCSS(),
            parts.clean(PATHS.build),
            parts.loadJS(PATHS.app),
            parts.minifyJavaScript({ useSourceMap: true }),
            parts.generateSourcemaps('source-map'),
            parts.extractCSS()
        );
    }

    return merge(
        common,
        {
            performance: {
                hints: false
            },
            plugins: [
                new webpack.NamedModulesPlugin()
            ]
        },
        parts.loadCSS(PATHS.app),
        parts.loadJS(PATHS.app),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT
        })
    );
};

function isVendor(module, count) {
  const userRequest = module.userRequest;

  if (typeof userRequest !== 'string') {
    return false;
  }

  return userRequest && userRequest.indexOf('node_modules') >= 0;
}