module.exports = {
    presets: [
        [
            '@babel/preset-env',
            {
                corejs: '3',
                useBuiltIns: 'usage',
                modules: false
            }
        ]
    ],
    plugins: [
        ['@babel/plugin-proposal-decorators', { "legacy": true }],
        ['@babel/plugin-proposal-class-properties', { "loose" : true }],
        ["@babel/plugin-transform-modules-commonjs", {
          "allowTopLevelThis": true
        }],
        '@babel/plugin-syntax-dynamic-import',
        '@babel/plugin-transform-runtime',
        'babel-plugin-stylus-compiler'
    ],
    comments: false,
}
