const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, "./src/index.tsx"),
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              "@babel/preset-env",
              "@babel/preset-react",
              "@babel/preset-typescript",
            ],
          },
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "./public"),
    },
    compress: false,
    port: 3000,
  },
  output: {
    filename: 'app.js',
    path: path.join(__dirname, "./build"),
  },
  plugins: [
    new HtmlWebpackPlugin({
        template: path.join(__dirname, './public', 'index.html')
    })
  ],
};
