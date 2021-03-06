const path = require('path')
const webpack = require('webpack')
const fs = require('fs')

const HMR = require('fastify-webpack-hmr')

function fastifyDevtools (fastify, opts) {
  const compiler = opts.compiler || webpack(config(opts))
  // bundle({ compiler })
  fastify.register(HMR, { compiler })
}
// bundle()

function bundle (opts) {
  console.log('>>> start bundle build')
  const compiler = opts.compiler || webpack(config(opts))
  if (opts.watch) {
    const watching = compiler.watch({
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: true
    }, (err, stats) => printStats(stats))
  } else {
    compiler.run((err, stats) => printStats(stats))
  }

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

module.exports = { bundle, config, resolveApp, fastifyDevtools }

function resolveApp (subdir) {
  return path.resolve(path.join('.', subdir))
}

function config (opts) {
  opts = opts || {}
  const hotConf = 'webpack-hot-middleware/client?path=/__webpack_hmr'
  const entry = opts.entry || resolveApp('src/app/index.js')
  const output = opts.output || resolveApp('build/dev')
  return {
//    entry: opts.entry || resolveApp('src/app/index.js'),
    entry: {
      main: [entry, hotConf]
    },
    output: {
      path: output,
      filename: 'app.js',
      publicPath: '/build',
    },

    stats: false,
    mode: 'development',
    devtool: 'cheap-eval-source-map',

    plugins: [
      // new HtmlWebpackPlugin({ alwaysWriteToDisk: false }),
      // new LiveReloadPlugin(),
      //new CopyPlugin([
      //  { from: resolveApp('src/app/assets'), to: output },
      //]),
      new webpack.HotModuleReplacementPlugin()

    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          include: resolveApp('src/app'),
          use: {
            loader: '@sucrase/webpack-loader',
            options: {
              transforms: ['jsx', 'react-hot-loader']
            }
          }
        },
        {
          test: /\.jsx?$/,
          include: /node_modules/,
          use: ['react-hot-loader/webpack'],
        }
      ]
    }
  }
}
