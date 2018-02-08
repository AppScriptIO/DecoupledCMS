import r from 'rethinkdb'
import { curryNamed } from 'appscript/utilityFunction/namedCurry.js'
import assert from "assert"

// IMPORTANT: when false value (null, empty, undefined) is passed as key, the query will get all keys in db document.
function getTableDocument(databaseName, tableName) {
    return async function getCondition(connection, key) {
        let result;
        if(key) {
            result = await r
                .db(databaseName)
                .table(tableName)
                .filter({key: key})
                .coerceTo('array')
                .run(connection)
            // result = await cursor.toArray(function(err, result) { // convert cursor stream to an array.
            //     if (err) throw err;
            //     return result
            // });
            return result[0]
        } else {
            result = await r
                .db(databaseName)
                .table(tableName)
                .coerceTo('array')
                .run(connection)
            return result
        }
    }
}

async function getTableDocumentAllParams({ databaseName, tableName, connection, key }) {
    let result;
    if(key) {
        result = await r
            .db(databaseName)
            .table(tableName)
            .filter({key: key})
            .coerceTo('array')
            .run(connection)
        // result = await cursor.toArray(function(err, result) { // convert cursor stream to an array.
        //     if (err) throw err;
        //     return result
        // });
        return result[0]
    } else {
        result = await r
            .db(databaseName)
            .table(tableName)
            .coerceTo('array')
            .run(connection)
        return result
    }
}

let requiredArgument = ['databaseName', 'tableName', 'connection', /* 'key' */ ] // commented out are optional
let curried = curryNamed(requiredArgument, getTableDocumentAllParams) // 

export { getTableDocument as default, curried}