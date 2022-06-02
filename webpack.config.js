const path = require('path');
const distPath = path.resolve(__dirname, 'dist');
const srcPath = path.resolve(__dirname, 'src');

const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const main = {
  entry: path.resolve(srcPath, '__loader__/App.ts'),
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
  plugins: [
    new ESLintPlugin({ extensions: ['ts'] }),
    new ForkTsCheckerWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.ts'],
    plugins: [new TsconfigPathsPlugin()],
  },
  externals: [nodeExternals()],
  externalsPresets: { node: true },
  stats: {
    preset: 'minimal',
    assets: false,
    modules: false,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  output: {
    filename: '[name].js',
    path: distPath,
    clean: true,
  },
};

module.exports = [main];
