"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));

// throws on unsupported content type.
// Brings extra option for handling error and unsupported content-types.
function _default() {
  return async (context, next) => {
    // parse request body
    if (context.request.method !== 'OPTIONS') {
      // context.request.body = await parse({
      //     req: context.request
      // })
      await (0, _koaBodyparser.default)()(context, next); // same as co-body but skips co-body parser for unsupported content-type, which prevents co-body from throwing error.
    } else {
      await next();
    }
  };
}