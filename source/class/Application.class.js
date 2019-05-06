"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.instance = exports.default = void 0;

var _http = _interopRequireDefault(require("http"));

var _assert = _interopRequireDefault(require("assert"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _events = _interopRequireDefault(require("events"));

var _configurationExport = _interopRequireDefault(require("../../setup/configuration/configuration.export.js"));

var _koa = _interopRequireDefault(require("koa"));

var _commonDatabaseFunctionality = require("../utilityFunction/middleware/commonDatabaseFunctionality.js");

var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");

var _addStaticSubclassToClassArray = _interopRequireDefault(require("@dependency/commonPattern/source/addStaticSubclassToClassArray.staticMethod"));

var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

var _underscore = _interopRequireDefault(require("underscore"));

var _getTableDocumentQuery = _interopRequireDefault(require("@dependency/databaseUtility/source/getTableDocument.query.js"));

var _dec, _dec2, _class, _class2, _temp;

const self = (_dec = (0, _decoratorUtility.add)({
  to: 'static'
}, {
  addStaticSubclassToClassArray: _addStaticSubclassToClassArray.default
}), _dec2 = _extendedSubclassPattern.extendedSubclassPattern.Superclass(), _dec(_class = _dec2(_class = (_temp = _class2 = class Application extends _events.default {
  /* Core event emitter module, different from the module used in the static property "self.eventEmitter" */
  static async initialize()
  /*staticSubclass*/
  {
    // One-time initialization of Applicaiton Class.
    console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green);

    _assert.default.notStrictEqual(self.config.HOST, undefined);

    self.rethinkdbConnection = await (0, _commonDatabaseFunctionality.connect)(); // TODO: Sync settings between multiple underscore installations or fix issue when multiple installations present.
    // Solution option - when underscore used outside appscript module, export it to get it's settings.
    // underscore template should have one single instance accross application - To affect changes of _ to the main app.

    let underscorePath = require.resolve('underscore');

    let appLevelUnderscorePath = _path.default.resolve(__dirname, '../../../node_modules/underscore/underscore.js');

    if (_fs.default.existsSync(appLevelUnderscorePath) && underscorePath !== appLevelUnderscorePath) {
      // case - multiple underscore installations present
      console.log(`• Underscore template - Found multiple underscore installations, Using appscript local underscore instance (module in lower hierarchy) i.e. ${underscorePath}.`); // self.underscore = require(appLevelUnderscorePath)
      // throw 'Found multiple underscore installations. This will prevent consistent settings between modules that use underscore for templating e.g. koa-view and local appscript underscore usage.'
    } else {
      // single either appscript module installation or applevel installation.
      console.log(`• Underscore template - Found a single installation of underscore, using ${underscorePath}.`); // self.underscore = require(underscorePath)
    }

    _underscore.default.templateSettings = {
      // initial underscore template settings on first import gets applied on the rest.
      evaluate: /\{\%(.+?)\%\}/g,
      interpolate: /\{\%=(.+?)\%\}/g,
      escape: /\{\%-(.+?)\%\}/g
    };
    console.info(`• Underscore template setting set as ${_underscore.default.templateSettings.evaluate} ${_underscore.default.templateSettings.interpolate} ${_underscore.default.templateSettings.escape}`);
    await self.eventEmitter.emit('initializationEnd');
    await self.eventEmitter.emit('addSubclass');
    await self.loadFrontendData(); // initialize template document front end.
    // if(staticSubclass) self.addStaticSubclassToClassArray(staticSubclass)

    console.log('• App up & running !');
  } // Used by extended subclasses:


  static initializeStaticClass() {
    // used for extended subclasses
    let self = this;
    self.serverKoa = self.createKoaServer();
  }

  static async applyKoaMiddleware(middlewareArray = false) {
    const self = this;
    if (middlewareArray) self.middlewareArray = middlewareArray;
    await self.middlewareArray.forEach(middleware => {
      self.serverKoa.use(middleware);
    }, this);
  }

  static createKoaServer() {
    let serverKoa = new _koa.default(); // export if script is required.

    if (self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1; // i.e. localhost

    return serverKoa;
  }

  static createHttpServer() {
    return new Promise((resolve, reject) => {
      const self = this;
      self.httpServer = _http.default.createServer(self.serverKoa.callback()); // self.httpServer.on('connection', (socket) => {
      //     console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
      //     socket.on('end', () => { console.info('SOCKET END: other end of the socket sends a FIN packet') })
      //     socket.on('timeout', () => { console.info('SOCKET TIMEOUT') })
      //     socket.on('error', (error) => { console.info('SOCKET ERROR: ' + JSON.stringify(error)) })
      //     socket.on('close', (had_error) => { console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error) })
      // })
      // self.httpServer.setTimeout(0, () => {
      //     console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')
      // })

      self.httpServer.listen(self.port, () => {
        console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green);
        resolve();
      });
    });
  }

  static async loadFrontendData() {
    let getTableDocument = {
      generate: _getTableDocumentQuery.default,
      instance: []
    };
    getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('webappSetting', 'template_documentFrontend');
    const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](self.rethinkdbConnection);
    let defaultLanguage = 'English'; // let uiContent = await queryPatternImplementation({
    //     databaseConnection: Application.rethinkdbConnection,
    //     languageDocumentKey: defaultLanguage,
    //     dataTableName: 'ui'
    // })

    self.frontendStatic = {
      // Configurations passed to frontend 
      config: self.config,
      setting: {
        location: {
          routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`,
          cdnBasePath: self.extendedSubclass.static['StaticContent'].url
        },
        mode: {
          // version / mode of app
          language: defaultLanguage // default language

        }
      },
      route: 'route',
      document: documentFrontendData // uiContent: uiContent

    };
  }

}, _class2.rethinkdbConnection = {}, _class2.config = _configurationExport.default, _temp)) || _class) || _class);
exports.default = self;
const instance = new self();
exports.instance = instance;