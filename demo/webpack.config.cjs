const path = require('path');

module.exports = {
  mode: 'development',
  entry: {
    viewer: path.resolve(__dirname, 'src/viewer.js'),
    editor: path.resolve(__dirname, 'src/editor.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    clean: true
  },
  resolve: {
    extensions: [ '.js', '.json' ]
  },
  devtool: 'source-map'
};
