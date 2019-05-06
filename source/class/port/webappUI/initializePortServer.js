"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaViews = _interopRequireDefault(require("koa-views"));

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _WebappUIClass = _interopRequireDefault(require("./WebappUI.class.js"));

var _nodeRelationshipGraph = _interopRequireDefault(require("@dependency/nodeRelationshipGraph"));

var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));

// Middleware extending server functionality
const {
  Issuer
} = require('openid-client');

let MiddlewareController = (0, _nodeRelationshipGraph.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Middleware',
  cacheName: true
});
let ConditionController = (0, _nodeRelationshipGraph.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Condition',
  cacheName: true
});

var _default = ({
  entrypointConditionKey
} = {}) => async () => {
  const oidcPort = 8084;
  const issuer = await Issuer.discover(`http://localhost:${oidcPort}`);
  const oidcClient = new issuer.Client({
    client_id: 'privateClientApplication',
    client_secret: 'secret',
    id_token_signed_response_alg: 'RS256',
    // defaults to RS256
    token_endpoint_auth_method: 'client_secret_basic' // defaults to client_secret_basic

  });
  // keystore is an optional argument for instantiating a client with configured asymmetrical ID Token or UserInfo response encryption
  let authURL = oidcClient.authorizationUrl({
    redirect_uri: 'https://lvh.me/cb',
    scope: 'openid'
  });
  let Class = _WebappUIClass.default; // Templating engine & associated extention.
  // Class.serverKoa.use()

  let middlewareArray = [(0, _koaViews.default)('/', {
    map: {
      html: 'underscore',
      js: 'underscore'
    }
  }), (0, _createClassInstancePerRequestMiddleware.default)(Class), async (context, next) => {
    // debugLogMiddleNestedUnitStructure('91140de5-9ab6-43cd-91fd-9eae5843c74c') 
    context.set('connection', 'keep-alive');
    await next();
  }, async (context, next) => {
    // CONDITION
    let self = Class; // [1] Create instances and check conditions. Get callback either a function or document
    // The instance responsible for rquests of specific port.

    let conditionController = await ConditionController.createContext({
      portAppInstance: context.instance
    });
    let entrypointConditionTree = entrypointConditionKey || self.entrypointSetting.defaultConditionTreeKey;
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`);
    let callbackOption = await conditionController.initializeNestedUnit({
      nestedUnitKey: entrypointConditionTree
    }); // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
    // [2] Use callback

    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callbackOption.name}`, self.config.style.green);
    await (0, _implementConditionActionOnModuleUsingJson.default)({
      setting: callbackOption
    })(context, next);
  }, async (context, next) => {
    if (context.path == '/oidcClient') {
      console.log(authURL);
      let introspection = await oidcClient.introspect('token') // => Promise
      .then(function (response) {
        return response;
      });
      context.body = introspection;
    }

    await next();
  }, async (context, next) => {
    console.log('Last Middleware reached.');
    await next();
  }];
  Class.applyKoaMiddleware(middlewareArray);
  Class.createHttpServer();
};

exports.default = _default;