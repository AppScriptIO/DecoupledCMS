import { class as Application } from '../../Application.class.js'
import WebSocketModule from 'ws'
import { add, execute, applyMixin } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

const self =
  @execute({ staticMethod: 'initializeStaticClass' })
  @extendedSubclassPattern.Subclass()
  class WebSocket extends Application {
    static port
    static webSocketServer
    static url

    static initializeStaticClass(self) {
      self.port = 8087
      self.url = `${self.config.SOCKET_PROTOCOL}websocket.${self.config.HOST}`
    }

    constructor(skipConstructor = false) {
      super(true)
      if (skipConstructor) return
    }

    static createWebsocketServer() {
      return new Promise((resolve, reject) => {
        // WebSocket - ws package.
        const websocketPort = self.port
        self.webSocketServer = new WebSocketModule.Server({ port: websocketPort }, () => {
          console.log(`☕%c ${self.name} listening on port ${websocketPort}`, Application.config.style.green)
          resolve()
        })
      })

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
    }
  }

export default self
