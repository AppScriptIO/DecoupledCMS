import r from 'rethinkdb'

async function getValueReturningFile(connection, key) {

    let result = await r
        .db("webapp").table("setting").get("valueReturningFile")("valueReturningFile")
        .filter(r.row("key").eq(key))
        .run(connection)
        
    return result[0]

}

export default getValueReturningFile