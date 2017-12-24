
import WebSocketModule from 'ws'
import WebSocketClass from 'appscript/class/port/webSocket/WebSocket.class.js'

export default ({} = {}) => () => {
    let Class = WebSocketClass
    Class.createWebsocketServer()
    Class.webSocketServer.on('connection', function connection(ws) {
        // console.log('client connected !')
        ws.on('message', function incoming(message) {
            console.log('received: %s', message);  
            Class.webSocketServer.clients.forEach(function each(client) {
                if (client !== ws && client.readyState === WebSocketModule.OPEN) {
                  client.send(message);
                }
              });
        });
        var i = 0
        
        // setInterval(function() {
        //     i++
        //     console.log('interval running ! ' + i)
            if(ws.readyState == WebSocketModule.OPEN) ws.send(i);
        // }, 500);    
    })
}