import configuration from '../configuration/configuration.export.js' // Load configuration settings.
import Koa from 'koa' // Koa applicaiton server
import compose from 'koa-compose'
import rethinkdbConfig from '../configuration/rethinkdbConfig.js'
import _ from '../../../node_modules/underscore' // To affect changes of _ to the main app.
const EventEmitter = require('events')
import { connect } from '../database/commonDatabaseFunctionality.js'
import getDatabaseTableDocument from '../database/query/getDatabaseTableDocument.query.js'

const self = class Application extends EventEmitter {

    static eventEmitter;
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

    static async initialize(staticSubclassArray) { // One-time initialization of Applicaiton Class.
        console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green)
        self.rethinkdbConnection = await connect()
        const documentData = await getDatabaseTableDocument(self.rethinkdbConnection)
        self.eventEmitter = new self()
        self.frontend = { // Configurations passed to frontend 
            config: self.config,
            setting: {
                location: {
                    routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`
                }
            },
            route: 'route',
            document: documentData,
        }
        _.templateSettings = { // initial underscore template settings on first import gets applied on the rest.
            evaluate: /\{\%(.+?)\%\}/g,
            interpolate: /\{\%=(.+?)\%\}/g,
            escape: /\{\%-(.+?)\%\}/g
        };
        self.addSubclass(staticSubclassArray)
    }
    static addSubclass(staticSubclassArray) {
        staticSubclassArray.map((subclass) => {
            self.registerStaticSubclass(subclass)
        })
    }
    constructor(skipConstructor = false) {
        super();
        if(skipConstructor) return;
    }

    static initializeStaticClass() { // used for extended subclasses
        let self = this
        self.serverKoa = self.createKoaServer()
    }

    static registerStaticSubclass(subclass) { // Get subclasses constructors and add them to WebappUI static arrray.
        self.extendedSubclass.static[subclass.name] = subclass
    }

    createSubclassInstance() { // Create subclasses instances and add to WebappUI static array.
        let self = this.constructor
        self.subclassPath.asInstance.forEach((subclassPath) => {
            let subclass = require(subclassPath)
            self.extendedSubclass.instance[subclass.name] = new subclass()
        }, this)
    }

    static createKoaServer() {
        let serverKoa = new Koa() // export if script is required.
        if(self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost
        return serverKoa
    }

    static async applyKoaMiddleware() {
        let self = this
        await self.middlewareArray.forEach((middleware) => {
            self.serverKoa.use(middleware)
        }, this);
    }


}

export default self