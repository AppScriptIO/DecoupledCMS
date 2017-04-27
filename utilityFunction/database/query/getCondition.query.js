import r from 'rethinkdb'

async function getCondition(connection, key) {
    let result = await r
        .db("webapp").table("setting").get("conditionImplementation")("conditionImplementation")
        .filter(r.row("key").eq(key))
        .run(connection)
        
    return result[0]

}

export default getCondition