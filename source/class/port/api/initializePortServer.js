"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApiClass = _interopRequireDefault(require("./Api.class.js"));

var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));

var _implementMiddlewareOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js"));

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
  let Class = _ApiClass.default;
  let middlewareArray = [(0, _createClassInstancePerRequestMiddleware.default)(Class), async (context, next) => {
    context.set('connection', 'keep-alive');
    context.set('Access-Control-Allow-Origin', '*');
    await context.req.setTimeout(30000);
    await next();
  }, async (context, next) => {
    // MIDDLEWARE e.g. body parser
    let middlewareArray;
    let middlewareController = await MiddlewareController.createContext({
      portAppInstance: context.instance
    });
    middlewareArray = await middlewareController.initializeNestedUnit({
      nestedUnitKey: '84sfad-f783-410e-a5c9-a21679a45beb'
    });
    await (0, _implementMiddlewareOnModuleUsingJson.default)(middlewareArray)(context, next);
  }, async (context, next) => {
    let conditionController = await ConditionController.createContext({
      portAppInstance: context.instance
    });
    let callback = await conditionController.initializeNestedUnit({
      nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f'
    });
    let isCalledNext = await (0, _implementConditionActionOnModuleUsingJson.default)({
      setting: callback
    })(context, next);
    if (!isCalledNext) await next();
  }, async (context, next) => {// console.log('Reached last middleware')
  }];
  Class.applyKoaMiddleware(middlewareArray);
  await Class.createHttpServer();
};

exports.default = _default;