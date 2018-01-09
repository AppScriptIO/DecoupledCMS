const EventEmitter = require('events')
import http from 'http'
import assert from 'assert'
import configuration from '../configuration/configuration.export.js' // Load configuration settings.
import Koa from 'koa' // Koa applicaiton server
import compose from 'koa-compose'
import rethinkdbConfig from '../configuration/rethinkdbConfig.js'
import _ from '../../../node_modules/underscore' // To affect changes of _ to the main app.
import { connect } from 'appscript/utilityFunction/middleware/commonDatabaseFunctionality.js'
import { add, execute, applyMixin } from 'appscript/utilityFunction/decoratorUtility.js'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'

const self = 
@add({ to: 'static'}, {
    addStaticSubclassToClassArray
})
@extendedSubclassPattern.Superclass()
class Application extends EventEmitter {

    static rethinkdbConnection = {}
    static config = configuration // Array
    static frontend;
   
    static async initialize(/*staticSubclass*/) { // One-time initialization of Applicaiton Class.
        console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green)
        assert.notStrictEqual(self.config.HOST, undefined)
        
        self.rethinkdbConnection = await connect()
        _.templateSettings = { // initial underscore template settings on first import gets applied on the rest.
            evaluate: /\{\%(.+?)\%\}/g,
            interpolate: /\{\%=(.+?)\%\}/g,
            escape: /\{\%-(.+?)\%\}/g
        };
        await self.eventEmitter.emit('initializationEnd')
        await self.eventEmitter.emit('addSubclass')
        // if(staticSubclass) self.addStaticSubclassToClassArray(staticSubclass)
    }

// Used by extended subclasses:

    static initializeStaticClass() { // used for extended subclasses
        let self = this
        self.serverKoa = self.createKoaServer()
    }

    static async applyKoaMiddleware(middlewareArray = false) {
        const self = this
        if(middlewareArray) self.middlewareArray = middlewareArray
        await self.middlewareArray.forEach((middleware) => {
            self.serverKoa.use(middleware)
        }, this)
    }

    static createKoaServer() {
        let serverKoa = new Koa() // export if script is required.
        if(self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost
        return serverKoa
    }

    static createHttpServer() {
        const self = this
        self.httpServer = http.createServer(self.serverKoa.callback())
            .on('connection', (socket) => {
                socket.setTimeout(0, () => {
                    console.log('HTTP server connection socket was timedout (console.log in socket.setTimeout)!')
                }); // request socket.
            })
            .listen(self.port, ()=> {
                console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
            })
        self.httpServer.setTimeout(0, () => {
            console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')
        })
    }

}
const instance = new self();

export { self as default, instance as instance }