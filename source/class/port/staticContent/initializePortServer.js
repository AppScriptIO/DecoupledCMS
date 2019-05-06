"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaViews = _interopRequireDefault(require("koa-views"));

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _StaticContentClass = _interopRequireDefault(require("./StaticContent.class.js"));

var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));

var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));

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

var _default = ({
  entrypointConditionKey
} = {}) => async () => {
  let Class = _StaticContentClass.default; // Templating engine & associated extention.
  // Class.serverKoa.use()

  let middlewareArray = [(0, _koaViews.default)('/', {
    map: {
      html: 'underscore',
      js: 'underscore'
    }
  }), (0, _createClassInstancePerRequestMiddleware.default)(Class), // async (context, next) => {
  //     // // Authorization access example:
  //     // let token = await OAuthClass.authenticateMiddleware()(context.request, context.response);
  //     // if(token) {
  //     //     await next()
  //     // } else {
  //     //     console.log('Sorry unauthorized access')
  //     // }
  //     await next()
  async (context, next) => {
    // CONDITION
    let self = Class; // [1] Create instances and check conditions. Get callback either a function or document
    // The instance responsible for rquests of specific port.

    let conditionController = await ConditionController.createContext({
      portAppInstance: context.instance
    });
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionKey} \n \n`);
    let callback = await conditionController.initializeNestedUnit({
      nestedUnitKey: entrypointConditionKey
    }); // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
    // [2] Use callback

    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green);
    await (0, _implementConditionActionOnModuleUsingJson.default)({
      setting: callback
    })(context, next);
  }, async (context, next) => {
    // console.log('Last Middleware reached.')
    await next();
    context.compress = true;
  }];
  Class.applyKoaMiddleware(middlewareArray);
  Class.createHttpServer();
};

exports.default = _default;