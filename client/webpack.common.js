const path = require("path")
const webpack = require("webpack")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin")
const { DefinePlugin } = require("webpack")

const dirNode = "node_modules"
const dirApp = path.join(__dirname, "src")
const dirStyles = path.join(__dirname, "styles")
const dirAssets = path.join(__dirname, "assets")

module.exports = (env) => {
  const IS_DEV = !!env.dev

  return {
    entry: ["@babel/polyfill", "./src/index.js"],

    resolve: {
      modules: [dirNode, dirApp, dirStyles, dirAssets],
    },

    plugins: [
      new webpack.DefinePlugin({ IS_DEV }),

      new DefinePlugin({
        "process.env": {
          API_BASE_URL: JSON.stringify(process.env.API_BASE_URL || ""),
        },
      }),

      new HtmlWebpackPlugin({
        template: path.join(__dirname, "index.html"),
      }),

      new ImageMinimizerPlugin({
        minimizerOptions: {
          plugins: [
            [
              "imagemin-svgo",
              {
                plugins: [
                  {
                    removeViewBox: false,
                    removeXMLNS: true,
                  },
                ],
              },
            ],
          ],
        },
      }),
    ],

    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: "babel-loader",
            options: {
              compact: true,
            },
          },
        },

        {
          test: /\.css$/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: IS_DEV,
              },
            },
          ],
        },

        {
          test: /\.scss/,
          use: [
            "style-loader",
            {
              loader: "css-loader",
              options: {
                sourceMap: IS_DEV,
              },
            },
            {
              loader: "sass-loader",
              options: {
                sourceMap: IS_DEV,
                sassOptions: {
                  includePaths: [dirAssets],
                },
              },
            },
          ],
        },

        {
          test: /\.(png|jpe?g|gif)$/i,
          use: {
            loader: "file-loader",
            options: {
              name: "[path][name].[ext]",
            },
          },
        },

        {
          test: /\.js$/,
          enforce: "pre",
          use: ["source-map-loader"],
        },
      ],
    },

    optimization: {
      runtimeChunk: "single",
    },
  }
}
