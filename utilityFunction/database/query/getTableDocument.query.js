import r from 'rethinkdb'
import { curryNamed } from 'appscript/utilityFunction/namedCurry.js'

function getTableDocument(documentId) {
    return async function getCondition(connection, key) {
        let result;
        if(key) {
            result = await r
                .db("webappSetting")
                .table(documentId)
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
                .db("webappSetting")
                .table(documentId)
                .coerceTo('array')
                .run(connection)
            return result
        }
    }
}

async function getTableDocumentAllParams({ documentId, connection, key }) {
    let result;
    if(key) {
        result = await r
            .db("webappSetting")
            .table(documentId)
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
            .db("webappSetting")
            .table(documentId)
            .coerceTo('array')
            .run(connection)
        return result
    }
}

let curried = curryNamed(['documentId', 'connection', 'key'], getTableDocumentAllParams)

export { getTableDocument as default, curried}