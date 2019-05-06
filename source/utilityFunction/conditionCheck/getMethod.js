"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _default = self => {
  let context = self.context;
  return context.request.method;
};

exports.default = _default;