"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = () => {
  return async (context, next) => {
    // fallback to sending the app index. If not found.
    await next();
  };
};

exports.default = _default;