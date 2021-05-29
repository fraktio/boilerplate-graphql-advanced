/* eslint-disable @typescript-eslint/no-var-requires */
const slsw = require("serverless-webpack");
const { merge } = require("webpack-merge");

const prod = require("./webpack.prod.js");

module.exports = merge(prod, {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
});
