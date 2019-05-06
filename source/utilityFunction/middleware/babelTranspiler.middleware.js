"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.transformJavascript = void 0;

var _configurationExport = _interopRequireDefault(require("../../../setup/configuration/configuration.export.js"));

var _path = _interopRequireDefault(require("path"));

var _stream = _interopRequireDefault(require("stream"));

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _middlewarePatternDecorator = require("../middlewarePatternDecorator.js");

var _streamToStringConvertion = require("../streamToStringConvertion.js");

let babel, nativeClientSideRuntimeCompilerConfig;

if (_ApplicationClass.default.config.DEPLOYMENT == 'development') {
  // as in production appDeploymentLifecycle dependency doesn't exist.
  babel = require('/project/application/dependency/appDeploymentLifecycle/babel_javascriptTranspilation.js/node_modules/@babel/core');
  nativeClientSideRuntimeCompilerConfig = require(_path.default.normalize(`${_configurationExport.default.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/compilerConfiguration/nativeClientSideRuntime.BabelConfig.js`));
}

let transformJavascript = (0, _middlewarePatternDecorator.functionWrappedMiddlewareDecorator)(async function (context, next, option) {
  // transpile only on development and non-distribution folders, i.e. on-the-fly transpilation is executed only in development, while production and distribution should be already transpiled.
  if (_ApplicationClass.default.config.DEPLOYMENT == 'development' && !_ApplicationClass.default.config.DISTRIBUTION && context.response.type == 'application/javascript') {
    let path = context.path;
    let scriptCode = context.body;
    let transformBabelPlugin = [];

    if (path.includes('webcomponent/@package')) {
      // in case an npm webcomponent package
      transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins;
    } else {
      // in case a custom project element
      transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins;
    }

    let transformBabelPreset = nativeClientSideRuntimeCompilerConfig.presets;

    if (transformBabelPlugin.length) {
      // convert stream into string
      if (scriptCode instanceof _stream.default.Stream) scriptCode = await (0, _streamToStringConvertion.streamToString)(scriptCode); // transform code using array of plugins.

      let transformedObject = babel.transformSync(scriptCode, {
        presets: transformBabelPreset,
        plugins: transformBabelPlugin
      });
      context.body = transformedObject.code;
    }
  }

  await next();
});
exports.transformJavascript = transformJavascript;