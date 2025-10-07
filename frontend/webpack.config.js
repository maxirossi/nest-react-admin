const webpack = require('webpack');

module.exports = function override(config, env) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env),
    })
  );
  
  return config;
};
