import compose from 'koa-compose'
import Application from 'appscript'

// let staticMiddlewareSetting = r
//     .table('setting') // first field assigns name of table
//     .run(context.rethinkdbConnection)
//     .then((cursor) => {
//         return cursor.toArray()
//     })

/**
 * @param {array} staticMiddlewareSetting holds the json middle configurations. Where each json is composed of executionType, functionPath, arguments.
 */
export default (staticMiddlewareSetting) => {
    let middlewareArray = []

    staticMiddlewareSetting.forEach((setting) => {
        let middleware;
        switch (setting.executionType) {
            case 'middleware':
                middleware = require(`${setting.functionPath}`)
                middlewareArray.push(middleware) 
            break;
            case 'regularFunction':
            default:
                middleware = setting.arguments ? require(`${setting.functionPath}`)(setting.arguments) : require(`${setting.functionPath}`)();
                middlewareArray.push(middleware) 
            break;
        }
    }, this);

    return compose(middlewareArray)
}
