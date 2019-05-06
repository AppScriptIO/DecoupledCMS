"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _https = _interopRequireDefault(require("https"));

var _http = _interopRequireDefault(require("http"));

var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");

var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

var _dec, _dec2, _class, _class2, _temp;

const self = (_dec = (0, _decoratorUtility.execute)({
  staticMethod: 'initializeStaticClass'
}), _dec2 = _extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = (_temp = _class2 = class WebappUI extends _ApplicationClass.default {
  static initializeStaticClass(self) {
    super.initializeStaticClass();
    self.port = 80;
  }

  constructor(skipConstructor = false) {
    super(true);
    this.middlewareArray = [];
    this.config = {}; // populated by useragentDetection module.

    if (skipConstructor) return; // if (!new.target) console.log(new.target) // not supported by babel
    // if (!(this instanceof WebappUI)) return new WebappUI() // This is used in factory functions not classes.
  } // async handleTemplateDocument(documentKey) {
  //     let documentObject = await getTableDocument.instance['template_documentBackend'](self.rethinkdbConnection, documentKey)
  //     // context.instance.config.clientBasePath should be defined using useragentDetection module.
  //     // NOTE:  documentKey should be received from database and nested unit key retreived from there too.
  //     // document could have different rules for users etc.. access previlages
  //     let templateController = await new TemplateController(false, { portAppInstance: this.context.instance })
  //     let renderedContent = await templateController.initializeNestedUnit({ nestedUnitKey: documentObject.viewNestedUnit })
  //     this.context.body = renderedContent;
  //     // // let argument = {
  //     // //     layoutElement: 'webapp-layout-list'
  //     // // }
  //     // // let mainDocumentElement = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.html`, 'utf-8')
  //     // // let mainDocumentElementImport = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.import.html`, 'utf-8')
  //     // // Shared arguments between all templates being rendered
  //     // const templateArgument = {
  //     //      templateController,
  //     //     context: this.context,
  //     //     Application,
  //     //     argument: {}
  //     // }
  //     // const view = {
  //     //     metadata: _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/asset/metadata/metadata.html`, 'utf-8')),
  //     //     header: _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.js.html`, 'utf-8')),
  //     //     // body: _.template(mainDocumentElement, {Application, argument})
  //     // }
  //     // let template = _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 'utf-8'))
  //     // this.context.body = template( 
  //     //     Object.assign(
  //     //         {}, 
  //     //         templateArgument, 
  //     //         { view, templateArgument }
  //     //     )
  //     // )
  //     // // Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
  //     // // await this.context.render(
  //     // //     `${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 
  //     // //     Object.assign({}, templateArgument, { view, templateArgument })
  //     // // );
  // }


  static createHttpServer() {
    const self = this;
    self.createdHttpServer = _http.default.createServer(self.serverKoa.callback()).listen(self.port, () => {
      console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green); // eventEmitter.emit('listening')
      // process.emit('listening')

      if (process.send !== undefined) {
        // if process is a forked child process.
        if (self.config.DEPLOYMENT == 'development') process.send({
          message: 'Server listening'
        });
      }
    }); // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
    // TODO: The below should work, but for some reason the paths stopped working 'no suck file', - relative paths don't work

    if (self.config.ssl) {
      let options = {
        key: _fs.default.readFileSync(_path.default.join(__dirname, '/sampleSSL/server.key')),
        cert: _fs.default.readFileSync(_path.default.join(__dirname, './sampleSSL/server.crt'))
      };
      self.createdHttpServer = _https.default.createServer(options, self.serverKoa.callback()).on('connection', socket => {
        socket.setTimeout(120);
      }).listen(443, () => {
        console.log(`☕%c ${self.name} listening on port 443`, self.config.style.green);
      });
    }
  }

}, _class2.entrypointSetting = {
  defaultConditionTreeKey: 'default'
}, _class2.middlewareArray = [], _temp)) || _class) || _class);
var _default = self;
exports.default = _default;