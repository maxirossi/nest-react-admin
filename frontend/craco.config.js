const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  webpack: {
    plugins: [
      new webpack.DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
    ],
  },
};
