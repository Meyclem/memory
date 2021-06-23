const path = require("path")
const { merge } = require("webpack-merge")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const CopyPlugin = require("copy-webpack-plugin")
const common = require("./webpack.common")

module.exports = (env) =>
  merge(common(env), {
    mode: "production",

    devtool: "source-map",

    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].bundle.js",
    },

    plugins: [
      new CleanWebpackPlugin(),

      new CopyPlugin({
        patterns: [{ from: path.join(__dirname, "assets"), to: "assets" }],
      }),
    ],
  })
