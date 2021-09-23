const path = require("path");
const WebpackSvgStore = require("./dist/svgstore");

module.exports = {
  mode: "development",
  entry: "./example/src/index.js",
  output: {
    path: path.resolve(__dirname, "example", "dist"),
    filename: "bundle.[name].js",
    publicPath: "/dist/",
  },
  resolve: {
    extensions: [".js"],
  },
  plugins: [
    new WebpackSvgStore({
      path: path.resolve(__dirname, "example/static/svg/**/*.svg"),
      fileName: "svg-sprites.svg",
    }),
  ],
};
