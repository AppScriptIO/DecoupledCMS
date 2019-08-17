import compose from 'koa-compose'
import { class as Application } from '../../class/Application.class.js'

// let staticMiddlewareSetting = r
//     .table('setting') // first field assigns name of table
//     .run(context.rethinkdbConnection)
//     .then((cursor) => {
//         return cursor.toArray()
//     })

/**
 * @param {array} staticMiddlewareSetting holds the json middle configurations. Where each json is composed of executionType, filePath, arguments.
 */
export default (
  staticMiddlewareSetting, // middleware nested units array.
) => {
  let middlewareArray = []

  staticMiddlewareSetting.forEach(setting => {
    // TODO: create an options extractor function.
    let filePath = setting.file.filePath // nested unit file's properties.
    let argument = setting.arguments // nested unit unit's properties.
    let executionType = setting.executionType // nested unit unit's properties.
    let importModuleName = setting.importModuleName

    // import/load module
    let exportedModule =
      !importModuleName || importModuleName == 'default'
        ? require(filePath).default // import default export from the module
        : require(filePath)[importModuleName] // import the export using it's name.

    // execute module
    let middleware
    switch (executionType) {
      case 'middleware':
        middleware = exportedModule
        break
      case 'functionWrappedMiddleware':
      default:
        middleware = argument ? exportedModule(argument) : exportedModule()
        break
    }
    middlewareArray.push(middleware)
  }, this)
  return compose(middlewareArray)
}
