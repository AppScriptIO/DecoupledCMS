import compose from 'koa-compose'
import Application from 'appscript'

// let staticMiddlewareSetting = r
//     .table('setting') // first field assigns name of table
//     .run(context.rethinkdbConnection)
//     .then((cursor) => {
//         return cursor.toArray()
//     })

export default (staticMiddlewareSetting) => {
    let middlewareArray = []

    staticMiddlewareSetting.forEach((setting) => {
        let middleware = require(`${setting.functionPath}`)(setting)
        middlewareArray.push(middleware) 
    }, this);

    return compose(middlewareArray)
}
