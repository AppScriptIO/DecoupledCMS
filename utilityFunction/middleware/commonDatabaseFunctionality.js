import rethinkdbConfig from '../../configuration/rethinkdbConfig.js'
import r from 'rethinkdb'
import _ from 'underscore'
import Application from '../../class/Application.class.js'

export function handleConnection() {
    return async (context, next) => {
        // context.rethinkdbConnection = await connect()
        // Application.rethinkdbConnection = await context.rethinkdbConnection
        context.rethinkdbConnection = Application.rethinkdbConnection
        await next() // Execute database-dependent middleware
        // context.rethinkdbConnection.close().then(() => { // Close connection
        //     console.log('SZN - Rethinkdb database - connection closed')
        // })
    }
}

export function createDatabase() {
    return async (context, next) => {
        await r
            .dbList().contains(`${rethinkdbConfig.database}`)
            .do((databaseExists) => {
                return r.branch(
                    databaseExists,
                    { dbs_created: 0 },
                    r.dbCreate(`${rethinkdbConfig.database}`)
                );
            })
            .run(context.rethinkdbConnection)
            .catch((error) => {
                throw(error)
            })
        await next()
    }
}

export function createTable() {
    return async (context, next) => {
        let tableName = 'setting'
        await r
            .tableList().run(context.rethinkdbConnection).then((tableNames) => {
                if (! _.includes(tableNames, tableName)) {
                    return r.tableCreate(tableName).run(context.rethinkdbConnection);
                } else {
                    return;
                }
            })
            .catch((error) => {
                throw(error)
            })
        await next()
    }
}

export async function connect() {
    let connection = await r // Create connection
        .connect({
            host: rethinkdbConfig.host, 
            port: rethinkdbConfig.port, 
            db: rethinkdbConfig.database 
        })
    console.info(`☕Connected to RethinkDB.`)
    return connection
}

export function getSubdocument(context) {
    return r.db("webapp").table("setting").get("valueReturningFile")('valueReturningFile').filter(function(file) {
        return file("key").match("bc7a29ab-facc-4054-ae34-c1b853c31a10")
    }).run(context.rethinkdbConnection)

}

export async function getConditionTreeEntrypoint(connection) {
    let result = r
        .db("webapp").table("setting").get("conditionTree")("conditionTree")
        .filter((conditionTree) => {
            return conditionTree("key").match("default")
        })
        .run(connection)
    return result
}