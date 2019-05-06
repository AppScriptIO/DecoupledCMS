"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _default = async (context, next) => {
  let connection = _ApplicationClass.default.rethinkdbConnection;
  context.body = 'Provide an entrypoint for the api schema.';
};

exports.default = _default;