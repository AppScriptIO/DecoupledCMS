"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _ws = _interopRequireDefault(require("ws"));

var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");

var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

var _dec, _dec2, _class;

const self = (_dec = (0, _decoratorUtility.execute)({
  staticMethod: 'initializeStaticClass'
}), _dec2 = _extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = class WebSocket extends _ApplicationClass.default {
  static initializeStaticClass(self) {
    self.port = 8087;
    self.url = `${self.config.SOCKET_PROTOCOL}websocket.${self.config.HOST}`;
  }

  constructor(skipConstructor = false) {
    super(true);
    if (skipConstructor) return;
  }

  static createWebsocketServer() {
    return new Promise((resolve, reject) => {
      // WebSocket - ws package.
      const websocketPort = self.port;
      self.webSocketServer = new _ws.default.Server({
        port: websocketPort
      }, () => {
        console.log(`☕%c ${self.name} listening on port ${websocketPort}`, _ApplicationClass.default.config.style.green);
        resolve();
      });
    }); // Socket.io - npm package
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

}) || _class) || _class);
var _default = self;
exports.default = _default;