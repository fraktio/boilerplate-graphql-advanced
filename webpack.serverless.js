/* eslint-disable @typescript-eslint/no-var-requires */
const slsw = require("serverless-webpack");
const { merge } = require("webpack-merge");

const { isLocal } = slsw.lib.webpack;

const prod = require("./webpack.prod.js");

module.exports = merge(prod, {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  stats: "minimal",
});
