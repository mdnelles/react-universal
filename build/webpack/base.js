import webpack from 'webpack';
import Clean from 'clean-webpack-plugin';

import {
  paths,
  globals,
  aliases,
} from '../../config';

import {
  ReportStatsPlugin,
  WriteStatsPlugin,
} from '../utils';

const { __PROD__ } = globals;

const commonChunkPlugin = new webpack.optimize.CommonsChunkPlugin({
    name: 'vendor',
    filename: '[name].[hash].js',
    minChunks: module => module.resource &&
                         module.resource.indexOf('node_modules') !== -1,
});
commonChunkPlugin.__KARMA_IGNORE__ = true;

export const cssIdentName = __PROD__ ?
  '[hash:base64:16]' :
  '[name]__[local]___[hash:base64:5]';

export default {
  entry: {
    app: [
      paths.app('entryPoints/client'),
    ],
  },
  output: {
    filename: '[name].[hash].js',
    path: paths.dist('client'),
    publicPath: '/build/',
  },
  resolve: {
    extensions: ['', '.js', '.css'],
    alias: aliases,
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        exclude: /node_modules/,
        loader: 'json',
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?name=fonts/[name].[ext]'
          + '&limit=10000&minetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        include: /font/,
        loader: 'file?name=fonts/[name].[ext]',
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        exclude: /node_modules/,
        loader: 'file?name=assets/[name].[ext]',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        loaders: [
          'style',
          `css?modules&localIdentName=${cssIdentName}`,
          'cssnext',
        ],
      },
      {
        test: /\.css$/,
        include: /node_modules/,
        loaders: [
          'style',
          `css`,
        ],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      ...globals,
      __CLIENT__: true,
      __SERVER__: false,
    }),
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ReportStatsPlugin(),
    new WriteStatsPlugin(),
    new Clean(['/client'], paths.dist()),
    commonChunkPlugin,
  ],
};
