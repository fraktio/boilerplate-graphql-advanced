const CopyPlugin = require("copy-webpack-plugin");
const path = require("path")
const webpack = require("webpack")

module.exports = {
  entry: './app/index.ts',
  target: 'node',
  output: {
    filename: 'main.js',
    libraryTarget: "commonjs2"
  },
  stats: {
    errorDetails: true
  },
  resolve: {
    modules: ['node_modules'],
    extensions: ['.ts', '.js', '.json', '.graphql'],
    alias: {
      "~": path.resolve(__dirname, "./app"),
    }
  },
  module: {
    rules: [
      {
        use: {
          loader: 'ts-loader',
          options: {
            transpileOnly: true
          }
        },
        exclude: /node_modules/,
      },
    ],
  },
  externals: ["knex", "pg", "vue", "@vue/compiler-sfc"],
  plugins: [
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