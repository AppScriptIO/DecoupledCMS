"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = Class => {
  return async (context, next) => {
    let instance = new Class(); // create new instance for each request.

    instance.context = context;
    context.instance = instance;
    await next();
  };
};

exports.default = _default;