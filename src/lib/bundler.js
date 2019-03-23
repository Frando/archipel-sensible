const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const fs = require('fs')

// bundle()

function bundle (opts) {
  console.log('>>> start bundle build')
  const compiler = webpack(config(opts))
  //const watching = compiler.watch({
  //  aggregateTimeout: 300,
  //  ignored: /node_modules/,
  //  poll: true
  //}, (err, stats) => printStats(stats)}
  compiler.run((err, stats) => printStats(stats))
  
  function printStats (stats) {
    print('build finished')
    print('time: %ss', (stats.endTime - stats.startTime) / 1000)
    if (stats.hasErrors()) {
      print('ERRORS!')
      print(stats.toString())
    } else {
      print('no errors')
    }
  }

  function print (msg, ...args) {
    let str = '>>> ' + msg
    console.log(str, ...args)
  }
}

module.exports = bundle

function resolveApp (subdir) {
  return path.resolve(path.join('.', subdir))
}

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
          use: 
            {
              loader: '@sucrase/webpack-loader',
              include: resolveApp('src/app'),
              options: {
                transforms: ['jsx']
              }
            }
          
        }
      ]
    }
  }
}