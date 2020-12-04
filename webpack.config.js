const HtmlWebpackPlugin = require("html-webpack-plugin"),
  path = require("path");
module.exports = {
  mode: "development",
  entry: {
    index: "./lib/index.tsx",
  },
  output: {
    path: path.resolve(__dirname, "dist/lib"),
    library: "zyjUI",
    libraryTarget: "umd",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "awesome-typescript-loader",
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "index.html",
    }),
  ],
};
