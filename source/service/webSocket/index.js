import WebSocketModule from 'ws'
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'

let port = 8087
let webSocketServer
let url = `${self.config.SOCKET_PROTOCOL}websocket.${self.config.HOST}`

export const initialize = async () => {
  let webSocketServer = await new Promise((resolve, reject) => {
    // WebSocket - ws package.
    const websocketPort = self.port
    self.webSocketServer = new WebSocketModule.Server({ port: websocketPort }, () => {
      console.log(`☕%c ${self.name} listening on port ${websocketPort}`, consoleLogStyle.green)
      resolve()
    })
  })
  webSocketServer.on('connection', function connection(ws) {
    // console.log('client connected !')
    ws.on('message', function incoming(message) {
      console.log('received: %s', message)
      webSocketServer.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === WebSocketModule.OPEN) {
          client.send(message)
        }
      })
    })
    var i = 0

    // setInterval(function() {
    //     i++
    //     console.log('interval running ! ' + i)
    if (ws.readyState == WebSocketModule.OPEN) ws.send(i)
    // }, 500);
  })
}

// Socket.io - npm package
// var server = require('http').createServer();
// var io = require('socket.io')(server);
// io.on('connection', function(client){
//     console.log('client connected !')
//     var i = 0
//     setInterval(function() {
//         i++
//         client.emit('event',{name: 'safi', requestNumber: i})
//     }, 500);
//   client.on('event', function(data){});
//   client.on('disconnect', function(){});
// });
// server.listen(8087);

// Engine.io - engine.io package and client package JSPM.
// var engine = require('engine.io');
// var http = require('http').createServer().listen(8087);
// var server = engine.attach(http);
// server.on('connection', function (socket) {
//     console.log('Client connected !')
//     socket.on('message', function(data){ });
//     socket.on('close', function(){ });
// });
