"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _getTableDocumentAndFilterQuery = _interopRequireDefault(require("@dependency/databaseUtility/source/getTableDocumentAndFilter.query.js"));

async function debugLogMiddleNestedUnitStructure(nestedUnitKeyMiddleware) {
  const connection = Application.rethinkdbConnection;
  let counter = 1;

  async function getMiddlewareAndNestedMiddleware(key) {
    let getTableDocument = {
      generate: _getTableDocumentAndFilterQuery.default,
      instance: []
    };
    getTableDocument.instance['middleware_nestedUnit'] = getTableDocument.generate('middleware_nestedUnit');
    let middleware = await getTableDocument.instance['middleware_nestedUnit'](connection, {
      key: key
    });
    let string = ''.concat(middleware.label.name, ' (', middleware.key, ') ');

    for (let child of middleware.children) {
      let childString = await getMiddlewareAndNestedMiddleware(child.nestedUnit); // let tabString = '\t'.repeat(counter)

      string = await string.concat('\n', ' → ', childString);
    }

    counter++;
    return string;
  }

  console.log((await getMiddlewareAndNestedMiddleware(nestedUnitKeyMiddleware)));
}

var _default = debugLogMiddleNestedUnitStructure;
exports.default = _default;