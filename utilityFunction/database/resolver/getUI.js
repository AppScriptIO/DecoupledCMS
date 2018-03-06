import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import r from 'rethinkdb'
import { aggregation, multipleRelationship } from 'appscript/utilityFunction/database/query/patternImplementation.js'


// TODO: export singleDocument to be used for server side request when passing uiElement to the frontend after rendering files.


export default async function resolver({ portClassInstance, parentResult, args }) {
  let databaseConnection = portClassInstance.constructor.rethinkdbConnection
  let context = portClassInstance.context
  let parameter = context.request.query
  let databaseName = 'webappContent'

  // extract parameters
  let aggregatedKey = parameter.key
  let languageDocumentKey = parameter.language
  
  let result = await singleDocument({ databaseConnection, aggregatedKey, languageDocumentKey })
  return result
}

export async function singleDocument({
  databaseConnection,
  aggregatedKey,
  languageDocumentKey
}) {
  const contentDatabase = r.db('webappContent')
  let ui = contentDatabase.table('ui');
  let language = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship')
  let version = aggregation({ table: ui, aggregatedDocumentKey: aggregatedKey })

  let result = await
      multipleRelationship({
        relationshipTable, 
        tableArray: [ { name: 'ui', table: ui }, { name: 'language', table: language } ]
      })
      .filter((document) => { return document('language')('key').eq(languageDocumentKey) })
      .filter((document) => {
        return version.contains((version) => {
          return document('ui')('key').eq(version('key'))
        })
      })
      .getField('ui')
      // .coerceTo('array')
      .nth(0) // select first array item
      .run(databaseConnection);
  
  return result
}

// export { resolver as default, singleDocument as singleDocument }