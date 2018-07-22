import r from 'rethinkdb'

function getTableDocument(documentId) {
    return async function getCondition(connection, key) {
        let result;
        if(key) {
            result = await r
                .db("webapp").table("setting").get(documentId)(documentId)
                .filter(r.row("key").eq(key))
                .run(connection)
            return result[0]
        } else {
            result = await r
                .db("webapp").table("setting").get(documentId)(documentId)
                .run(connection)
            return result
        }
    }
}

export default getTableDocument