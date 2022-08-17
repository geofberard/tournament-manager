const path = require('path');
const webpack = require("webpack");

module.exports = {
  entry: `${__dirname}/src/main.tsx`,
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    port: 80,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  devtool: 'inline-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env.ENV_API_URL': JSON.stringify(process.env.API_URL),
      'process.env.ENV_STATIC_URL': JSON.stringify(process.env.STATIC_URL),
    }),
  ]
};
