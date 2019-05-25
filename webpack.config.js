const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const ROOT = path.join(__dirname, 'demo');
const SRC = path.join(ROOT, 'src');

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    index: path.join(SRC, 'index.js'),
  },
  output: {
    path: path.join(ROOT, 'build'),
    filename: 'static/[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: path.join(ROOT, 'index.html'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader'],
        include: SRC,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};
