const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = {
  configureWebpack: {
    devtool: 'source-map',
    plugins: [
      new MonacoWebpackPlugin()
    ]
  },
  outputDir: '../lyrebird_tracking/client/static',
  devServer: {
    proxy: 'http://localhost:9090'
  }
}