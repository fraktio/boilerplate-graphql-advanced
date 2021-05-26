const NodemonPlugin = require('nodemon-webpack-plugin')
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const dotenv = require('dotenv')
const path = require("path")

dotenv.config({ path: path.join(__dirname,'.env.development') });

module.exports = merge(common, {
  mode: 'development',
  plugins: [
    new NodemonPlugin(),
  ],
  devServer: {
    noInfo: true,
  },
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: 'errors-only',
});