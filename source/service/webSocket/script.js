import { createWebSocketServerWS, createWebSocketServerIO, createWebSocketServerEngineIO } from '../../utility/server.js'

// let url = `${config.SOCKET_PROTOCOL}websocket.${config.HOST}`
let port = 8087

export async function initialize({ targetProjectConfig }) {
  let server = await createWebSocketServerWS({ port })
  server.on('connection', client => {
    console.log('client connected !')
    client.on('message', message => {
      console.log('received: %s', message)
      server.clients.forEach(function each(client) {
        if (client !== client && client.readyState === webSocket.OPEN) {
          client.send(message)
        }
      })
    })
    var i = 0
    setInterval(function() {
      i++
      console.log('interval running ! ' + i)
      if (client.readyState == webSocket.OPEN) client.send(i)
    }, 500)
  })
}

// Using `socket.io` package.
export async function initialize2() {
  let server = await createWebSocketServerIOو({ port })
  server.on('connection', client => {
    console.log('client connected !')
    var i = 0
    setInterval(function() {
      i++
      client.emit('event', { name: 'safi', requestNumber: i })
    }, 500)
    client.on('event', function(data) {})
    client.on('disconnect', function() {})
  })
}

// Using `engine.io` package:
export async function initialize3() {
  let server = await createWebSocketServerEngineIO({ port })
  server.on('connection', socket => {
    console.log('Client connected !')
    socket.on('message', function(data) {})
    socket.on('close', function() {})
  })
}
