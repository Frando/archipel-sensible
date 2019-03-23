// require('module-alias/register')
console.log('go')
// const server = require('./server.js')
const bundler = require('./lib/bundler')
const makeServer = require('./lib/http-server')

// var http = require('http')

//create a server object:

// http
//   .createServer(function(req, res) {
//     res.write('Hello World!') //write a response to the client
//     res.end() //end the response
//   })
//   .listen(8080) //the server object listens on port 8080

if (process.env.NODE_ENV === 'development') {
  bundler({ entry: './src/app/index.js' })
  
}

// var childProcess = require('child_process').fork(__dirname + '/lib/bundler')
// process.on('exit', () => {
//   childProcess.stdin.pause();
//   childProcess.kill()
// })
// var cleanExit = function() { process.exit() };
// process.on('SIGINT', cleanExit); // catch ctrl-c
// process.on('SIGTERM', cleanExit); // catch kill

const server = makeServer()
server.serveApp()
server.start().then(() => {
  console.log('all up and running')
})
