/* eslint-disable @typescript-eslint/no-var-requires */
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const outputFolder = path.resolve(process.cwd(), "dist");

module.exports = {
  mode: "production",
  entry: path.join(process.cwd(), "/app/index.ts"),
  target: "node",
  output: {
    path: outputFolder,
    filename: "main.js",
    libraryTarget: "commonjs2",
  },
  stats: {
    errorDetails: true,
  },
  resolve: {
    modules: ["node_modules"],
    extensions: [".ts", ".js", ".json", ".graphql"],
    alias: {
      "~": path.resolve(__dirname, "./app"),
    },
  },
  module: {
    rules: [
      {
        use: {
          loader: "ts-loader",
          options: {
            transpileOnly: true,
          },
        },
      },
    ],
  },
  externals: [nodeExternals()],
  plugins: [
    new CleanWebpackPlugin({
      output: {
        path: outputFolder,
      },
    }),
    new CopyPlugin({
      patterns: [
        {
          context: "./app/graphql/schema/",
          from: "*",
          to: "./app/graphql/schema",
        },
      ],
    }),
  ],
};
