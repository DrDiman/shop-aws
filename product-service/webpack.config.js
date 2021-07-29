const path = require("path")
const slsw = require("serverless-webpack")
const nodeExternals = require("webpack-node-externals")

module.exports = {
  context: __dirname,
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  entry: slsw.lib.entries,
  devtool: slsw.lib.webpack.isLocal
    ? "eval-cheap-module-source-map"
    : "source-map",
  output: {
    libraryTarget: "commonjs",
    filename: "[name].js",
    path: path.join(__dirname, ".webpack"),
  },
  target: "node",
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        options: require("./.babelrc.js"),
      },
    ],
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"],
    alias: {
      "@enums": path.resolve("./src/enums"),
      "@functions": path.resolve("./src/functions"),
      "@libs": path.resolve("./src/libs"),
      "@models": path.resolve("./src/models"),
      "@services": path.resolve("./src/services"),
    },
  },
}
