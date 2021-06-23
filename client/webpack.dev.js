const dotenv = require("dotenv")

const { merge } = require("webpack-merge")
const common = require("./webpack.common")

dotenv.config()

module.exports = (env) =>
  merge(common(env), {
    mode: "development",

    devtool: "eval",

    output: {
      pathinfo: true,
      publicPath: "/",
      filename: "[name].bundle.js",
    },

    devServer: {
      host: "0.0.0.0",
      port: process.env.PORT,
    },
  })
