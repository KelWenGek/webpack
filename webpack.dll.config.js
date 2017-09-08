var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: {
        vendor: ['vue/dist/vue.esm.js', 'lodash', 'vuex', 'axios', 'vue-router', 'element-ui']
    },
    output: {
        path: path.join(__dirname, './static/js'),
        filename: '[name].dll.js',
        library: '[name]_library'
    },
    plugins: [
        new webpack.DllPlugin({
            context: __dirname,
            path: path.join(__dirname, '.', '[name]-manifest.json'),
            name: '[name]_library'
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};