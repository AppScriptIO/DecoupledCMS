import http from 'http'
import https from 'https'
import Koa from 'koa' // Koa applicaiton server
import webSocket from 'ws'
import engineIO from 'engine.io'
import socketIO from 'socket.io'
import consoleLogStyle from './consoleLogStyleConfig.js'

export async function createHttpServer({ label, port, middlewareArray }) {
  const serverKoa = new Koa() // create Koa server
  serverKoa.subdomainOffset = 1 // for localhost domain.
  // register middleware
  middlewareArray.forEach(middleware => serverKoa.use(middleware))
  await new Promise(
    (resolve, reject) =>
      http
        .createServer(serverKoa.callback())
        .listen(port, () => {
          if (process.send !== undefined) process.send({ message: 'Server listening' }) // if process is a forked child process.
          process.emit('listening')
          console.log(`☕%c ${label} server listening on port ${port}`, consoleLogStyle.style.green)
        })
        .on('connection', socket => {
          console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
          socket.on('end', () => console.info('SOCKET END: other end of the socket sends a FIN packet'))
          socket.on('timeout', () => console.info('SOCKET TIMEOUT'))
          socket.on('error', error => console.info('SOCKET ERROR: ' + JSON.stringify(error)))
          socket.on('close', had_error => console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error))
        })
        .setTimeout(0, () => console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')) && resolve(),
  )
}

// Using `ws` package.
export async function createWebSocketServerWS({ port }) {
  let server
  await new Promise((resolve, reject) => {
    server = new webSocket.Server({ port }, () => {
      console.log(`☕%c Websocket server listening on port ${port}`, consoleLogStyle.style.green)
      resolve()
    })
  })
  return server
}

// Using `io` package.
export async function createWebSocketServerIO({ port }) {
  let httpServer = http.createServer().listen(port)
  let server = socketIO(httpServer)
  return server
}

// Engine.io - engine.io package and client package JSPM.
export async function createWebSocketServerEngineIO({ port }) {
  let httpServer = http.createServer().listen(port)
  let server = engineIO.attach(httpServer)
  return server
}
