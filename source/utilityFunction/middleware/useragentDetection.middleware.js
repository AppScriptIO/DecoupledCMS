"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _path = _interopRequireDefault(require("path"));

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

const useragentParser = require('useragent'); // https://www.npmjs.com/package/useragent


require('useragent/features');

function isES5(agent) {
  switch (agent.family) {
    // Polymer serve https://github.com/Polymer/tools/blob/707ae99d2c0fd6e3edd7894d98a45ce574b39e6d/packages/browser-capabilities/src/browser-capabilities.ts
    case 'Chrome':
    case 'Chromium':
    case 'Chrome Headless':
      return agent.satisfies('<49.0.0') ? true : false;

    case 'Opera':
    case 'OPR':
      return agent.satisfies('<36.0.0') ? true : false;

    case 'Vivaldi':
      return agent.satisfies('<1') ? true : false;

    case 'Safari':
    case 'Mobile Safari':
      return agent.satisfies('<10.0.0') ? true : false;

    case 'Firefox':
      return agent.satisfies('<51.0.0') ? true : false;

    case 'Edge':
      return agent.satisfies('<15.0.63') ? true : false;

    case 'Other':
    default:
      return agent.source.toLowerCase().includes('postman') ? false : false; // default for native version rather than previous choice of polyfill as defalult

      break;
  }
} // USAGE: localhost/?distribution="<clientSide folder name"
// This module defines context.instance.config.clientBasePath to be later used in template composition.


var _default = async (context, next) => {
  let clientBasePath, clientSideFolderName;
  let agent = useragentParser.lookup(context.request.headers['user-agent']);
  context.instance.distribution = isES5(agent) ? 'polyfill' : 'native';

  switch (context.instance.distribution) {
    case 'polyfill':
      clientSideFolderName = _ApplicationClass.default.config.distribution.clientSide.polyfill.prefix;
      break;

    case 'native':
      clientSideFolderName = _ApplicationClass.default.config.distribution.clientSide.native.prefix;
      break;
  }

  if (_ApplicationClass.default.config.DEPLOYMENT == 'production') {
    clientBasePath = _ApplicationClass.default.config.distributionPath;
  } else if (_ApplicationClass.default.config.DEPLOYMENT == 'development') {
    if (_ApplicationClass.default.config.DISTRIBUTION) {
      clientBasePath = _ApplicationClass.default.config.distributionPath;
    } else {
      clientBasePath = _ApplicationClass.default.config.sourceCodePath;
      clientSideFolderName = _ApplicationClass.default.config.directory.clientSide.folderName;
    }
  }

  if (context.request.query.distribution) {
    clientBasePath = _ApplicationClass.default.config.distributionPath;
    clientSideFolderName = context.request.query.distribution;
  } // set resolved clientSide directory path.


  context.instance.config.clientSidePath = _path.default.join(clientBasePath, clientSideFolderName);
  await next();
};

exports.default = _default;