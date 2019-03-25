const fastify = require('fastify')
const fastifyStatic = require('fastify-static')
const websocket = require('fastify-websocket')
const p = require('path')
const url = require('url')
const http = require('http')
   const fastifyWebpackHmr = require('fastify-webpack-hmr')
    const { bundle, config, resolveApp } = require('./bundler')

module.exports = function makeServer(opts) {
  return new HttpServer(opts)
}

class HttpServer {
  constructor() {
    this.fastify = fastify()

    this._websocketHandler = {}
  }

  websocket(route, handle) {
    if (!Object.keys(this._websocketHandler).length) {
      this.fastify.register(websocket, {
        handle: this._handleWebsocket.bind(this)
      })
    }

    this._websocketHandler[route] = handle
  }

  _handleWebsocket(stream, req) {
    const { pathname } = url.parse(req.url)
    if (!this._websocketHandler[pathname]) {
      return stream.close()
    }
    this._websocketHandler[pathname](stream, req)
  }

  serveApp() {
    this.fastify.register(fastifyStatic, {
      root: resolveApp('build/dev')
    })
  }
  
  devtools (opts) {
 
    bundle(opts)
    this.fastify.register(fastifyWebpackHmr, { config: config(opts) })
  }

  get() {}

  async start() {
    await this.fastify.listen(process.env.PORT || 8080)
  }
}
