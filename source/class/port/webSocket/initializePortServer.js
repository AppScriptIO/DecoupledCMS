"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ws2 = _interopRequireDefault(require("ws"));

var _WebSocketClass = _interopRequireDefault(require("./WebSocket.class.js"));

var _default = ({} = {}) => async () => {
  let Class = _WebSocketClass.default;
  await Class.createWebsocketServer();
  Class.webSocketServer.on('connection', function connection(ws) {
    // console.log('client connected !')
    ws.on('message', function incoming(message) {
      console.log('received: %s', message);
      Class.webSocketServer.clients.forEach(function each(client) {
        if (client !== ws && client.readyState === _ws2.default.OPEN) {
          client.send(message);
        }
      });
    });
    var i = 0; // setInterval(function() {
    //     i++
    //     console.log('interval running ! ' + i)

    if (ws.readyState == _ws2.default.OPEN) ws.send(i); // }, 500);    
  });
};

exports.default = _default;