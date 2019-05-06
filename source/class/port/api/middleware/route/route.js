"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _koaRouter = _interopRequireDefault(require("koa-router"));

var _customQuery = _interopRequireDefault(require("../database/customQuery.js"));

let routerAPI = new _koaRouter.default({
  prefix: '/api/v1'
});
routerAPI.get('/test', _customQuery.default.test);

var _default = () => (0, _koaCompose.default)([routerAPI.routes(), routerAPI.allowedMethods()]);

exports.default = _default;