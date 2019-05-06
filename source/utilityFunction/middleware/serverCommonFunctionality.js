"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _serverConfig = _interopRequireDefault(require("../../../setup/configuration/serverConfig.js"));

var _koaCompose = _interopRequireDefault(require("koa-compose"));

var _koaResponseTime = _interopRequireDefault(require("koa-response-time"));

var _koaLogger = _interopRequireDefault(require("koa-logger"));

var _koaJsonError = _interopRequireDefault(require("koa-json-error"));

var _koaCompress = _interopRequireDefault(require("koa-compress"));

var _zlib = _interopRequireDefault(require("zlib"));

// import cors from 'kcors'
// import helmet from 'koa-helmet'
// import enforceHTTPS from 'koa-sslify'
let middlewareArray = [(0, _koaResponseTime.default)(), // Response time x-response-time
(0, _koaLogger.default)(), // Console logger
// bodyParser(),
(0, _koaJsonError.default)(), // Error handler for pure-JSON Koa apps
// handleConnection(), // Open connection on middleware downstream, Close connection on upstream.
// createDatabase(),
(0, _koaCompress.default)({
  flush: _zlib.default.Z_SYNC_FLUSH
})];

if (!_serverConfig.default.ssl) {// middleware.push(compress())  // Compress responses
  // middleware.push(enforceHTTPS())
  // middleware.push(helmet()) // Security header middleware collection
}

var _default = () => (0, _koaCompose.default)(middlewareArray);

exports.default = _default;