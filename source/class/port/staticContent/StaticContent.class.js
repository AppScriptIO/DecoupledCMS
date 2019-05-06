"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");

var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

var _dec, _dec2, _class, _class2, _temp;

const self = (_dec = (0, _decoratorUtility.execute)({
  staticMethod: 'initializeStaticClass'
}), _dec2 = _extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = (_temp = _class2 = class StaticContent extends _ApplicationClass.default {
  static initializeStaticClass(self) {
    super.initializeStaticClass();
    self.port = 8081;
    self.url = `${self.config.PROTOCOL}cdn.${self.config.HOST}`;
  }

  constructor() {
    super(true);
    this.middlewareArray = [];
    this.config = {}; // populated by useragentDetection module.
  }

}, _class2.middlewareArray = [], _temp)) || _class) || _class);
var _default = self;
exports.default = _default;