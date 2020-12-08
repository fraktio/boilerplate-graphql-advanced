/* eslint-disable @typescript-eslint/no-var-requires */
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const slsw = require("serverless-webpack");
const nodeExternals = require("webpack-node-externals");

const { isLocal } = slsw.lib.webpack;

module.exports = {
  mode: isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  stats: "minimal",
  externals: [nodeExternals()],
  target: "node",
  resolve: {
    extensions: [".js", ".json", ".ts"],
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts(x?)$/,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          context: "./src/graphql/schema/",
          from: "*",
          to: "./src/schema",
        },
      ],
    }),
  ],
};
