var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var CopyWebpackPlugin = require('copy-webpack-plugin')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackIncludeAssetsPlugin = require('html-webpack-include-assets-plugin')
var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
var InlineManifestWebpackPlugin = require('inline-manifest-webpack-plugin')
module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    pathinfo: true,
    publicPath: '/',
    filename: '[name].[hash:8].js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
            // Since sass-loader (weirdly) has SCSS as its default parse mode, we map
            // the "scss" and "sass" values for the lang attribute to the right configs here.
            // other preprocessors should work out of the box, no loader config like this necessary.
            'scss': 'vue-style-loader!css-loader!sass-loader',
            'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: './static/img/[name].[ext]?[hash]'
        }
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    contentBase: path.join(__dirname, 'dist')
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  plugins: [
    new webpack.DllReferencePlugin({
      context: __dirname,
      manifest: require('./vendor-manifest.json')
    }),
    new HtmlWebpackPlugin({
      inject: true,
      filename: 'index.html',
      template: './index.html'
    }),
    new HtmlWebpackIncludeAssetsPlugin({
      assets: ['static/js/vendor.dll.js'],
      append: false
      // ,
      // hash: true
      // ,
      // publicPath: ''
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'manifest'
    }),
    new InlineManifestWebpackPlugin({
      name: 'webpackManifest'
    }),
    new CopyWebpackPlugin([{
      from: 'static',
      to: 'static'
    }]),
    new CleanWebpackPlugin(['dist'])
  ]
}

if (process.env.NODE_ENV === 'production') {
  module.exports.devtool = '#source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    // new webpack.optimize.UglifyJsPlugin({
    //   sourceMap: true,
    //   compress: {
    //     warnings: false
    //   }
    // }),

    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ]).concat(process.env.npm_config_report ? [new BundleAnalyzerPlugin()] : [])
}