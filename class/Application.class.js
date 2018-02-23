import http from 'http'
import assert from 'assert'
import path from 'path'
import filesystem from 'fs'
import EventEmitter from 'events'
import configuration from '../configuration/configuration.export.js' // Load configuration settings.
import Koa from 'koa' // Koa applicaiton server
import compose from 'koa-compose'
import rethinkdbConfig from '../configuration/rethinkdbConfig.js'
import { connect } from 'appscript/utilityFunction/middleware/commonDatabaseFunctionality.js'
import { add, execute, applyMixin } from 'appscript/utilityFunction/decoratorUtility.js'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import underscore from 'underscore'
import {default as getTableDocumentDefault} from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import { singleDocument } from "appscript/utilityFunction/database/resolver/getUI.js";

const self = 
@add({ to: 'static'}, {
    addStaticSubclassToClassArray
})
@extendedSubclassPattern.Superclass()
class Application extends EventEmitter { /* Core event emitter module, different from the module used in the static property "self.eventEmitter" */
    
    static rethinkdbConnection = {}
    static underscore;
    static config = configuration // Array
    static frontend;
    
    static async initialize(/*staticSubclass*/) { // One-time initialization of Applicaiton Class.
        console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green)
        assert.notStrictEqual(self.config.HOST, undefined)
        
        self.rethinkdbConnection = await connect()
        
        // TODO: Sync settings between multiple underscore installations or fix issue when multiple installations present.
        // Solution option - when underscore used outside appscript module, export it to get it's settings.
        // underscore template should have one single instance accross application - To affect changes of _ to the main app.
        let underscorePath = require.resolve('underscore')
        let appLevelUnderscorePath = path.resolve(__dirname, '../../../node_modules/underscore/underscore.js')
        if(filesystem.existsSync(appLevelUnderscorePath) && underscorePath !== appLevelUnderscorePath) {
            // case - multiple underscore installations present
            console.log(`• Underscore template - Found multiple underscore installations, Using appscript local underscore instance (module in lower hierarchy) i.e. ${underscorePath}.`)
            // self.underscore = require(appLevelUnderscorePath)
            // throw 'Found multiple underscore installations. This will prevent consistent settings between modules that use underscore for templating e.g. koa-view and local appscript underscore usage.'
        } else {
            // single either appscript module installation or applevel installation.
            console.log(`• Underscore template - Found a single installation of underscore, using ${underscorePath}.`)
            // self.underscore = require(underscorePath)
        }
        
        underscore.templateSettings = { // initial underscore template settings on first import gets applied on the rest.
            evaluate: /\{\%(.+?)\%\}/g,
            interpolate: /\{\%=(.+?)\%\}/g,
            escape: /\{\%-(.+?)\%\}/g
        }
        console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)

        await self.eventEmitter.emit('initializationEnd')
        await self.eventEmitter.emit('addSubclass')
        await self.loadFrontendData() // initialize template document front end.

        // if(staticSubclass) self.addStaticSubclassToClassArray(staticSubclass)
        console.log('• App up & running !')
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
        return new Promise((resolve, reject) => {
            const self = this
            self.httpServer = http.createServer(self.serverKoa.callback())
            // self.httpServer.on('connection', (socket) => {
            //     console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
            //     socket.on('end', () => { console.info('SOCKET END: other end of the socket sends a FIN packet') })
            //     socket.on('timeout', () => { console.info('SOCKET TIMEOUT') })
            //     socket.on('error', (error) => { console.info('SOCKET ERROR: ' + JSON.stringify(error)) })
            //     socket.on('close', (had_error) => { console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error) })
            // })
            // self.httpServer.setTimeout(0, () => {
            //     console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')
            // })
            self.httpServer.listen(self.port, ()=> {
                console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
                resolve()
            })
        })
    }

    static async loadFrontendData() {
        let getTableDocument = {
            generate: getTableDocumentDefault,
            instance: []
        }
        getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('webappSetting', 'template_documentFrontend')
        const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](self.rethinkdbConnection)
        self.frontend = { // Configurations passed to frontend 
            config: self.config,
            setting: {
                location: {
                    routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`,
                    cdnBasePath: self.extendedSubclass.static['StaticContent'].url
                }
            },
            route: 'route',
            document: documentFrontendData, 
            uiContent: await singleDocument({
                databaseConnection: Application.rethinkdbConnection,
                aggregatedKey: 't1',
                languageDocumentKey: 'English'
            })
        }    
    }

}
const instance = new self();

export { self as default, instance as instance }