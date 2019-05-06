"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let data = [{
  key: '301ff7c3-e0f7-45be-9ac3-8ce2c88416fe',
  label: {
    name: 'get all articles'
  },
  algorithm: {
    type: 'file',
    path: 'appscript/utilityFunction/database/resolver/aggregationPatternResolver.js',
    argument: {
      databaseTable: 'article'
    }
  }
}, {
  key: '74df-e0f7-45be-9ac3-8ce2c88416fe',
  label: {
    name: 'get ui elements content'
  },
  algorithm: {
    type: 'file',
    path: 'appscript/utilityFunction/database/resolver/aggregationPatternResolver.js',
    argument: {
      databaseTable: 'ui'
    }
  }
}, {
  key: '4sdaf5-e0f7-45be-9ac3-8ce2c88416fe',
  label: {
    name: 'extractFieldFromParentDataset'
  },
  algorithm: {
    type: 'file',
    path: 'appscript/utilityFunction/database/resolver/extractFieldFromParentDataset.js',
    argument: {}
  }
}, {
  key: '4sdaf5-e0f7-45be-9ac3-9asdf',
  label: {
    name: 'get personalInfo data'
  },
  algorithm: {
    type: 'file',
    path: 'appscript/utilityFunction/database/resolver/aggregationPatternResolver.js',
    argument: {
      databaseTable: 'personalInfo'
    }
  }
}];
var _default = data;
exports.default = _default;