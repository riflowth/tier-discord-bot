const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const app = {
  entry: path.resolve(srcPath, 'App.ts'),
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        include: srcPath,
        options: { transpileOnly: true },
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
    plugins: [new TsconfigPathsPlugin()],
  },
  plugins: [
    new ESLintPlugin({ extensions: ['ts'] }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  externalsPresets: { node: true },
  externals: [nodeExternals()],
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({ extractComments: false })],
  },
  output: {
    filename: 'app.js',
    path: distPath,
    clean: true,
  },
};

module.exports = [app];
