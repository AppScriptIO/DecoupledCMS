"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _default;

function _default() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800');
    await next();
  };
}