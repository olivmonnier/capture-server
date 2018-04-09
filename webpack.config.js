
const { join } = require('path')
const APP_DIR = join(__dirname, '/public/src')
const BUILD_DIR = join(__dirname, '/public/dest')

module.exports = {
  entry: {
    app: join(APP_DIR, 'app.js')
  },
  output: {
    path: BUILD_DIR,
    filename: '[name].bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }]
      }
    ]
  }
}