"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _implementMiddlewareOnModuleUsingJson = _interopRequireDefault(require("./implementMiddlewareOnModuleUsingJson.js"));

var _nodeRelationshipGraph = _interopRequireDefault(require("@dependency/nodeRelationshipGraph"));

// Middleware extending server functionality
let MiddlewareController = (0, _nodeRelationshipGraph.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Middleware',
  cacheName: true
});
/**
 * @param {object} Setting holds the json configurations. Where each json is composed of setting.type, setting.name.
 */

var _default = ({
  setting // condition nested unit callback properties's options.

}) => {
  let executionType = setting.type; // condition callback property

  return async (context, next) => {
    let isCalledNext = false; // console.log(setting)

    switch (executionType) {
      case 'middlewareNestedUnit':
        // await context.instance.handleMiddlewareNestedUnit(setting.name) // another way is to create a method in the instance class.        
        const nestedUnitKey = setting.name;
        const portAppInstance = context.instance;
        let middlewareArray;
        let middlewareController = await MiddlewareController.createContext({
          portAppInstance: portAppInstance
        });
        middlewareArray = await middlewareController.initializeNestedUnit({
          nestedUnitKey: nestedUnitKey
        });

        if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') {
          // print middleware file paths 
          console.group(`🍊 Middleware Array:`);
          middlewareArray.map(middlewareNode => {
            console.log(middlewareNode.file.filePath);
          });
          console.groupEnd();
        }

        await (0, _implementMiddlewareOnModuleUsingJson.default)(middlewareArray)(context, next);
        isCalledNext = true;
        break;

      case 'functionMiddleware':
        // await context.instance.handleFunctionMiddleware(setting.name)
        let filePath = setting.name;
        let middleware = await require(`${filePath}`).default;
        await middleware(context, next);
        isCalledNext = true;
        break;

      case 'portClassMethodMiddleware':
        let methodName = setting.name;
        let token = await context.instance[methodName](context.request, context.response);
        context.body = token;
        break;

      case 'consoleLogMessage':
        console.log(setting.name);
        break;

      default:
        if (process.env.SZN_DEBUG == 'true') console.log('SZN - %c Setting (callback) doesn\'t match any kind.', _ApplicationClass.default.config.style.red);
    }

    return isCalledNext;
  };
};

exports.default = _default;