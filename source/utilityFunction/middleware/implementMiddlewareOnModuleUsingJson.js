"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _koaCompose = _interopRequireDefault(require("koa-compose"));

// let staticMiddlewareSetting = r
//     .table('setting') // first field assigns name of table
//     .run(context.rethinkdbConnection)
//     .then((cursor) => {
//         return cursor.toArray()
//     })
var _default = (staticMiddlewareSetting // middleware nested units array.
) => {
  let middlewareArray = [];
  staticMiddlewareSetting.forEach(setting => {
    // TODO: create an options extractor function.
    let filePath = setting.file.filePath; // nested unit file's properties.

    let argument = setting.arguments; // nested unit unit's properties.

    let executionType = setting.executionType; // nested unit unit's properties.

    let importModuleName = setting.importModuleName; // import/load module

    let exportedModule = !importModuleName || importModuleName == 'default' ? require(filePath).default : // import default export from the module
    require(filePath)[importModuleName]; // import the export using it's name.
    // execute module

    let middleware;

    switch (executionType) {
      case 'middleware':
        middleware = exportedModule;
        break;

      case 'functionWrappedMiddleware':
      default:
        middleware = argument ? exportedModule(argument) : exportedModule();
        break;
    }

    middlewareArray.push(middleware);
  }, void 0);
  return (0, _koaCompose.default)(middlewareArray);
};

exports.default = _default;