import serverConfig from 'appscript/configuration/serverConfig.js'
import r from 'rethinkdb'

export async function test(context, next) {
    console.log('SZN - Inside <API>/test')
    // get universities
    await r
        .table('authors')
        .run(context.rethinkdbConnection)
        .then((cursor) => {
            return cursor.toArray()
        })
        .then((result) => {
            context.body = result
        })
    await next()
}

export default {
    test
}