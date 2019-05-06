"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _OpenIdConnectClass = _interopRequireDefault(require("./OpenIdConnect.class.js"));

var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));

var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

var _koaBodyParser = _interopRequireDefault(require("koa-bodyParser"));

var _koaMount = _interopRequireDefault(require("koa-mount"));

var _koaViews = _interopRequireDefault(require("koa-views"));

var _oidcInteractionMiddleware = require("../../../utilityFunction/middleware/oidcInteraction.middleware.js");

// mount koa app as middleware to another koa app
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
  let Class = _OpenIdConnectClass.default;
  /**
   * Ceates following routes: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L210
   * add middlware to the oidc koa server array following instructions - https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#registering-module-middlewares-helmet-ip-filters-rate-limiters-etc
   */
  // Class.serverKoa.use()

  let middlewareArray = [(0, _koaViews.default)('/', {
    map: {
      html: 'underscore',
      js: 'underscore'
    }
  }), // add koa views for html rendering.
  (0, _koaMount.default)( // mount oidc koa app as middlewares
  '/'
  /* base path to mount to */
  , Class.openIdConnectServer.app), (0, _createClassInstancePerRequestMiddleware.default)(Class), (0, _koaBodyParser.default)(), // async (context, next) => {
  //     // instance.middlewareArray.push(middleware)
  //     // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).          
  //     await context.set('Access-Control-Allow-Origin', '*')
  //     await context.set('connection', 'keep-alive')
  //     await next()
  (0, _oidcInteractionMiddleware.oidcInteractionEntrypoint)({
    openIdConnectServer: Class.openIdConnectServer
  }), (0, _oidcInteractionMiddleware.oidcInteractionLogin)({
    openIdConnectServer: Class.openIdConnectServer
  }), (0, _oidcInteractionMiddleware.oidcInteractionConfirm)({
    openIdConnectServer: Class.openIdConnectServer
  })];
  Class.applyKoaMiddleware(middlewareArray);
  Class.createHttpServer();
};

exports.default = _default;