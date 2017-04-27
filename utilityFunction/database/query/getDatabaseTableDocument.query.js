import r from 'rethinkdb'

function getDatabaseTableDocument(connection) {

    let result = r
        .db("webapp").table("setting").get("document")("document")
        .run(connection)

    return result

}

export default getDatabaseTableDocument