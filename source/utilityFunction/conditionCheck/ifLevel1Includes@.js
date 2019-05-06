"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getUrlPathAsArray = _interopRequireDefault(require("./getUrlPathAsArray.js"));

var _default = async self => {
  let context = self.context;
  let pathArray = await (0, _getUrlPathAsArray.default)(self);
  let firstPath = pathArray.shift(); // get url path
  // check if function sign exists

  return firstPath.includes('@') ? true : false;
};

exports.default = _default;