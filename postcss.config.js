module.exports = {
    plugins: [
        require('autoprefixer')({
            add: true,
            remove: false,
            browsers: [
                'last 2 versions',
                'ie >= 11'
            ]
        }),
        require('stylelint')({
            rules: {
                'color-hex-case': 'lower'
            },
            // Ignore node_modules CSS
            ignoreFiles: 'node_modules/**/*.css'
        }),
        require('cssnano')({
            discardComments: {
                removeAll: true
            },
            mergeLonghand: true
        })
    ]
};
