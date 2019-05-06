"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _default = async (context, next) => {
  let connection = _ApplicationClass.default.rethinkdbConnection;
  context.set('Access-Control-Allow-Methods', '*'
  /* 'POST, GET, OPTIONS, DELETE' */
  );
  context.set('Access-Control-Allow-Headers', '*'
  /* 'Content-Type' */
  ); // used as a response to preflight, indicating which headers can be used in the request.

  context.body = 'OK'; // previous middlewares should have already defined cross origin all *.
};

exports.default = _default;