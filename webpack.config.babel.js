const webpack = require('webpack');
const merge = require('webpack-merge');
const path = require('path');
const _ = require('lodash');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const SpritesmithPlugin = require('webpack-spritesmith');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

// Load config for HMR
const parts = require('./webpack.parts');

const PATHS = {
    root: path.resolve(__dirname),
    app: path.resolve(__dirname, 'app'),
    imgs: path.resolve(__dirname, 'imgs'),
    imgsSprites: path.resolve(__dirname, 'imgs/sprites'),
    entry: path.resolve(__dirname, 'app/app'),
    build: path.resolve(__dirname, 'build'),
    translations: path.resolve(__dirname, 'app/translation'),
    additions: {
        ga: './include/analytics/google/ga.js',
    },
    node_modules: path.resolve(__dirname, 'node_modules'),
};

let EXTERNAL_LIBS_REGEX = '';

const EXTERNAL_LIBS = [
/*    'angular/angular.js',
    'lodash/lodash.js',
    'd3/d3.js',
    'mapbox-gl/dist/mapbox-gl.js',
    'node_modules[^!]*\\.css',*/
];

EXTERNAL_LIBS.forEach((name, i) => {
    EXTERNAL_LIBS_REGEX += EXTERNAL_LIBS.length !== i + 1 ? `${name}|` : name;
});

EXTERNAL_LIBS_REGEX = new RegExp(EXTERNAL_LIBS_REGEX);

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
                        test: /\.js$/,
                        include: path.resolve(__dirname, 'node_modules/webworkify/index.js'),
                        loader: 'worker',
                    },
                    {
                        test: /\.html$/,
                        exclude: PATHS.app,
                        use: [
                            {
                                loader: 'underscore-template-loader',
                                options: {
                                    root: PATHS.root,
                                },
                            },
                        ],
                    },
                    {
                        test: /\.html$/,
                        include: PATHS.app,
                        use: [
                            'html-loader',
                        ],
                    },
                    {
                        test: /\.(eot|ttf|woff|woff2)$/,
                        loader: 'file-loader',
                    },
                   /* {
                        test: /\.svg$/,
                        include: PATHS.imgs,
                        exclude: PATHS.imgsSprites,
                        use: [
                            'file-loader',
                            'svg-fill-loader',
                            'svgo-loader',
                        ],
                    },*/
                    {
                        test: /\.svg$/,
                        include: PATHS.imgs,
                        use: [
                            {
                                loader: 'svg-sprite-loader',
                                /*options: {
                                    extract: true,
                                    spriteFilename: 'sprite.[hash].svg',
                                },*/
                            },
                        ],
                    },
                ],
                //noParse: EXTERNAL_LIBS_REGEX,
            },
            plugins: [
                new SpriteLoaderPlugin(),
                new SpritesmithPlugin({
                    src: {
                        cwd: `${PATHS.imgs}/sprites/png`,
                        glob: '*.png',
                    },
                    target: {
                        image: `${PATHS.imgs}/sprite.png`,
                        css: `${PATHS.root}/app/common/styles/sprite.scss`,
                    },
                    apiOptions: {
                        cssImageRef: '../../../imgs/sprite.png',
                    },
                }),
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
                        ROOT_FOLDER: JSON.stringify(PATHS.root),
                    },
                }),
                //TODO: Chunk files splitting doesn't work
/*                new webpack.optimize.AggressiveSplittingPlugin({
                    minSize: 10000,
                    maxSize: 400000,
                }),*/
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    minChunks: function minChunks (module) {
                        return module.context && module.context.indexOf('node_modules') !== -1 &&
                            module.context.indexOf('.css') === -1;
                    },
                }),
            ],
            resolve: {
                modules: [
                    PATHS.root,
                    'node_modules',
                    'spritesmith-generated',
                ],
                alias: {
                    webworkify: 'webworkify-webpack',
                    'mapbox-gl': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js'),
                },
            },
        },
    );

    if (IS_ENV_PROD) {
        return merge(
            common,
            parts.clean(PATHS.build),
            parts.imgsMinified(PATHS.root, imagesNameScheme),
            parts.minifyJavaScript({ useSourceMap: false }),
            parts.processCSS(PATHS),
            parts.copyJSON(PATHS.translations, TIMESTAMP),
            parts.moveVendors(),
            parts.banner(buildCfg),
        );
    } else if (IS_ENV_QA || IS_ENV_DEV) {
        return merge(
            common,
            parts.clean(PATHS.build),
            parts.imgsMinified(PATHS.root, imagesNameScheme),
            parts.minifyJavaScript({ useSourceMap: true }),
            parts.processCSS(PATHS),
            parts.generateSourcemaps('eval'),
            parts.copyJSON(PATHS.translations, TIMESTAMP),
            parts.moveVendors(),
            parts.banner(buildCfg),
            //parts.analyzer()
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
        parts.processCSS(PATHS),
        parts.generateSourcemaps('eval'),
        parts.devServer({
            host: process.env.HOST,
            port: process.env.PORT,
        }),
        //parts.analyzer(),
        //parts.dashboard(),
    );
};

