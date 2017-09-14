import r from 'rethinkdb'

function getTableDocument(documentId) {
    return async (connection, filterObject) => {
        let result;
        if(filterObject) {
            result = await r
                .db("webappSetting")
                .table(documentId)
                .filter(filterObject)
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

export default getTableDocument