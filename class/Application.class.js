import configuration from '../configuration/configuration.export.js' // Load configuration settings.
import Koa from 'koa' // Koa applicaiton server
import compose from 'koa-compose'
import rethinkdbConfig from '../configuration/rethinkdbConfig.js'
import _ from '../../../node_modules/underscore' // To affect changes of _ to the main app.
const EventEmitter = require('events')
import { connect } from 'appscript/utilityFunction/middleware/commonDatabaseFunctionality.js'
import getTableDocument from '../utilityFunction/database/query/getTableDocument.query.js'
const getDatabaseTableDocument = getTableDocument('documentFrontend')

import http from 'http'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'

const self = class Application extends EventEmitter {

    static eventEmitter = new EventEmitter() // i.e. new EventEmitter()
    static rethinkdbConnection = {}
    static config = configuration // Array
    static frontend;
    static extendedSubclass = {
        instance: [],
        static: []
    }
    static subclassPath = {
        asInstance: [
            'class/StaticContent.class.js',
            'class/Api.class.js',
            'class/Test.class.js',
        ],
        // asStatic: [
        //     // 'class/ConditionTree.class.js',
        //     // 'class/Condition.class.js',
        // ]
    }
   
    constructor(skipConstructor = false) {
        super();
        if(skipConstructor) return;
    }

    static async initialize(staticSubclass) { // One-time initialization of Applicaiton Class.
        console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green)
        self.rethinkdbConnection = await connect()
        const documentFrontendData = await getDatabaseTableDocument(self.rethinkdbConnection)
        self.frontend = { // Configurations passed to frontend 
            config: self.config,
            setting: {
                location: {
                    routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`
                }
            },
            route: 'route',
            document: documentFrontendData,
        }
        _.templateSettings = { // initial underscore template settings on first import gets applied on the rest.
            evaluate: /\{\%(.+?)\%\}/g,
            interpolate: /\{\%=(.+?)\%\}/g,
            escape: /\{\%-(.+?)\%\}/g
        };
        await self.eventEmitter.emit('initializationEnd')
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
        }, this);
    }

    static createKoaServer() {
        let serverKoa = new Koa() // export if script is required.
        if(self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost
        return serverKoa
    }

    static createHttpServer() {
        const self = this
        http.createServer(self.serverKoa.callback())
            .on('connection', (socket) => {
                socket.setTimeout(120);
            })
            .listen(self.port, ()=> {
                console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
            })
    }

}

self.addStaticSubclassToClassArray = addStaticSubclassToClassArray

const instance = new self();
export { self as default, instance as instance }