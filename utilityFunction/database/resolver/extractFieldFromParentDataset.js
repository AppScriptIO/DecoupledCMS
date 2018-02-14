import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import r from 'rethinkdb'

export default async function({ portClassInstance, parentResult, args }) {
    let connection = portClassInstance.constructor.rethinkdbConnection
    let context = portClassInstance.context
    let parameter = context.request.query
    let databaseName = 'webappContent'
    return parentResult[args.fieldToExtract]

  }