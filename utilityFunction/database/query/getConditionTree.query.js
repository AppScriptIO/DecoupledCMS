import r from 'rethinkdb'

async function getConditionTree(connection, key) {
    let result = await r
        .db("webapp").table("setting").get("conditionTree")("conditionTree")
        .filter(r.row("key").eq(key))
        .run(connection)
    return result[0]

}

export default getConditionTree