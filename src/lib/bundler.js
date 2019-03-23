const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')

// bundle()

function bundle (opts) {
  console.log('spawn')
  const compiler = webpack(config(opts))
  const watching = compiler.watch({
    // Example watchOptions
    aggregateTimeout: 300,
    ignored: /node_modules/,
    poll: true
  }, (err, stats) => {
    // Print watch/build result here...
    if (err) console.log(stats)
    else console.log('>>> build finished')
    // console.log(stats)
    // console.log(stats)
  })
}

module.exports = bundle

function config (opts) {
  opts = opts || {}

  return {
    entry: opts.entry || path.resolve(path.join('.', 'src/app/index.js')),
    mode: 'production',
    output: {
      path: opts.output || path.resolve(path.join('.', 'dist')),
      filename: 'app.js'
    },
    plugins: [
      new HtmlWebpackPlugin(),
      new LiveReloadPlugin()
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          use: {
            loader: '@sucrase/webpack-loader',
            options: {
              transforms: ['jsx']
            }
          }
        }
      ]
    }
  }
}