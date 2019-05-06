"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _nodeRelationshipGraph = _interopRequireDefault(require("@dependency/nodeRelationshipGraph"));

var _getUrlPathAsArray = _interopRequireDefault(require("../conditionCheck/getUrlPathAsArray.js"));

let SchemaController = (0, _nodeRelationshipGraph.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Schema',
  cacheName: true
});

var _default = async (context, next) => {
  let connection = _ApplicationClass.default.rethinkdbConnection;
  let schemaController = await SchemaController.createContext({
    portAppInstance: context.instance
  });
  let urlPathArray = await (0, _getUrlPathAsArray.default)(context.instance);
  let apiSchemaEntrypoint = urlPathArray.pop();
  let data = await schemaController.initializeNestedUnit({
    nestedUnitKey: apiSchemaEntrypoint
  });
  context.body = data;
  await next();
};

exports.default = _default;