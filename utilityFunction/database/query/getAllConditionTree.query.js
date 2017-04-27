import r from 'rethinkdb'

function getAllConditionTree(connection) {

    let result = r
        .db("webapp").table("setting").get("conditionTree")("conditionTree")
        .run(connection)

    return result

}

export default getAllConditionTree