/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require("dotenv");
const NodemonPlugin = require("nodemon-webpack-plugin");
const path = require("path");
const { merge } = require("webpack-merge");

const common = require("./webpack.common.js");

dotenv.config({ path: path.join(__dirname, ".env.development") });

module.exports = merge(common, {
  mode: "development",
  optimization: {
    minimize: false,
  },
  plugins: [
    new NodemonPlugin({
      ext: "ts,json,graphql",
    }),
  ],
  watchOptions: {
    ignored: /node_modules/,
  },
  stats: "errors-only",
});
