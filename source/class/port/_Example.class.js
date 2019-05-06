"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koa = _interopRequireDefault(require("koa"));

var _WebappUIClass = _interopRequireDefault(require("class/WebappUI.class.js"));

// API server
// Koa applicaiton server
class Test extends _WebappUIClass.default {
  constructor() {
    super(true);
    this.middlewareArray = [];
    this.port = 8083;
    this.createKoaServer();
  }

  createKoaServer() {
    this.serverKoa = new _koa.default(); // export if script is required.
  }

  applyKoaMiddleware() {
    this.middlewareArray.forEach(middleware => {
      this.serverKoa.use(middleware);
    }, this);
  }

}

var _default = Test;
exports.default = _default;