"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _patternImplementation = require("@dependency/databaseUtility/source/patternImplementation.js");

var _middlewarePatternDecorator = require("@dependency/commonPattern/source/middlewarePatternDecorator.js");

var _deepObjectMerge = require("@dependency/deepObjectMerge");

// throws on unsupported content type.
// Brings extra option for handling error and unsupported content-types.
var _default = (0, _middlewarePatternDecorator.functionWrappedMiddlewareDecorator)(async function (context, next, option) {
  let urlQuery = context.request.query;
  let queryLanguage = urlQuery.language ? urlQuery.language.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter.
  : null;
  let uiContent = null;
  let defaultLanguage = _ApplicationClass.default.frontendStatic.setting.mode.language;

  try {
    uiContent = await (0, _patternImplementation.getMergedMultipleDocumentOfSpecificLanguage)({
      databaseConnection: _ApplicationClass.default.rethinkdbConnection,
      languageDocumentKey: queryLanguage || defaultLanguage,
      dataTableName: 'ui'
    });
  } catch (error) {
    console.log(error);
  }

  let frontendPerContext = {
    setting: {
      mode: {
        language: queryLanguage || defaultLanguage // TODO: change setting default twice - fallback to prevent setting a null/undefined over the default value

      }
    },
    uiContent // TODO: separate frontend object creation from language middleware.

  };
  frontendPerContext.instance = context.instance; // add instance object as it is used by client side.

  context.frontend = (0, _deepObjectMerge.mergeDeep)(_ApplicationClass.default.frontendStatic, frontendPerContext);
  await next();
});

exports.default = _default;