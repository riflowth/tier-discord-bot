const path = require('path');
const buildPath = path.resolve(__dirname, 'dist');

const nodeExternals = require('webpack-node-externals');
const TerserPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const main = {
  entry: './src/__loader__/App.ts',
  module: {
    rules: [{
      test: /\.ts$/, use: ['ts-loader'], exclude: /node_modules/,
    }],
  },
  plugins: [
    new ESLintPlugin({
      extensions: ['ts'],
    }),
  ],
  externals: [nodeExternals()],
  target: 'node',
  output: {
    filename: '[name].js',
    path: buildPath,
    clean: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
    extensions: ['.ts', '.js'],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
};

module.exports = [main];