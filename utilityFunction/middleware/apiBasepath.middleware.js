import serverConfig from 'appscript/configuration/serverConfig.js'
import r from 'rethinkdb'

export default async (context, next) => {
    context.body = 'apiBasepath'    
    // get universities
    // await r
    //     .table('authors')
    //     .run(context.rethinkdbConnection)
    //     .then((cursor) => {
    //         return cursor.toArray()
    //     })
    //     .then((result) => {
    //         context.body = result
    //     })
    await next()
}
