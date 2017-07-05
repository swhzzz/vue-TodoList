module.exports = {
    entry: '.',
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    resolve: {
        alias: {
            vue: 'vue/dist/vue.js'
        }
    },
    module: {
        loaders: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: 'babel-loader?presets[]=es2015'
        }],
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }]
    },
    watch: true
}