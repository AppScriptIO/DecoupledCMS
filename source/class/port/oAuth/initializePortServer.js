"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaViews = _interopRequireDefault(require("koa-views"));

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _OAuthClass = _interopRequireDefault(require("./OAuth.class.js"));

var _implementMiddlewareOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js"));

var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));

var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));

var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

// Middleware extending server functionality
let MiddlewareController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Middleware',
  cacheName: true
});
let ConditionController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Condition',
  cacheName: true
});

var _default = ({} = {}) => async () => {
  let Class = _OAuthClass.default; // Templating engine & associated extention.

  Class.serverKoa.use((0, _koaViews.default)('/', {
    map: {
      html: 'underscore',
      js: 'underscore'
    }
  }));
  let middlewareArray = [(0, _createClassInstancePerRequestMiddleware.default)(Class), (0, _koaBodyparser.default)(), async (context, next) => {
    // instance.middlewareArray.push(middleware)
    // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).          
    await context.set('Access-Control-Allow-Origin', '*');
    await context.set('connection', 'keep-alive');
    await next();
  }, async (context, next) => {
    // let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
    // await wait(500)
    let middlewareController = await MiddlewareController.createContext({
      portAppInstance: context.instance
    });
    let middlewareArray = await middlewareController.initializeNestedUnit({
      nestedUnitKey: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec'
    });
    await (0, _implementMiddlewareOnModuleUsingJson.default)(middlewareArray)(context, next); // context.instance.config.clientBasePath = await Application.config.clientBasePath
    // await next()          
  }, async (context, next) => {
    // CONDITION
    let self = Class; // [1] Create instances and check conditions. Get callback either a function or document
    // The instance responsible for rquests of specific port.

    let conditionController = await ConditionController.createContext({
      portAppInstance: context.instance
    });
    let entrypointConditionTree = '0681f25c-4c00-4295-b12a-6ab81a3cb440';
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`);
    let callback = await conditionController.initializeNestedUnit({
      nestedUnitKey: entrypointConditionTree
    });
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green); // [2] Use callback

    await (0, _implementConditionActionOnModuleUsingJson.default)({
      setting: callback
    })(context, next);

    if (callback && callback.name == 'post') {
      // for testing purposes.
      let x = await Class.authenticate(context.request, context.response);
      if (x) await next();
    }
  }, async (context, next) => {
    context.status = 404; // console.log('Last Middleware reached.')

    await next();
  }];
  Class.applyKoaMiddleware(middlewareArray);
  Class.createHttpServer();
};

exports.default = _default;