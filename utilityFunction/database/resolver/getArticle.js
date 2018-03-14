import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import r from 'rethinkdb'
import { aggregation, multipleRelationship } from 'appscript/utilityFunction/database/query/patternImplementation.js'

export default async function({ portClassInstance, parentResult, args }) {
  let databaseConnection = portClassInstance.constructor.rethinkdbConnection
  let context = portClassInstance.context
  let parameter = context.request.query
  let databaseName = 'webappContent'

  // extract parameters
  let aggregatedArticleKey = parameter.key
  let languageDocumentKey = parameter.language
  
  let result = (aggregatedArticleKey) ?
    await singleDocument({ databaseConnection, aggregatedArticleKey, languageDocumentKey}) :
    await multipleDocument({ databaseConnection, languageDocumentKey }) ;
    
  return result
}

export async function singleDocument({
  databaseConnection,
  aggregatedArticleKey,
  languageDocumentKey
}) {
  const contentDatabase = r.db('webappContent')
  var article = contentDatabase.table('article');
  let language = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship')
  let version = aggregation({ table: article, aggregatedDocumentKey: aggregatedArticleKey })

  let result = await
      multipleRelationship({
        relationshipTable, 
        tableArray: [ { name: 'article', table: article }, { name: 'language', table: language } ]
      })
      .filter((document) => { return document('language')('key').eq(languageDocumentKey) })
      .filter((document) => {
        return version.contains((version) => {
          return document('article')('key').eq(version('key'))
        })
      })
      .getField('article')
      // .coerceTo('array')
      .nth(0) // select first array item
      .run(databaseConnection);
  
  return result
}

export async function multipleDocument({
  databaseConnection,
  languageDocumentKey
}) {
  const contentDatabase = r.db('webappContent')
  var article = contentDatabase.table('article');
  let language = contentDatabase.table('language');
  let relationshipTable = contentDatabase.table('relationship')

  let tableArray = [ { name: 'article', table: article }, { name: 'language', table: language } ]
  let result = await
      multipleRelationship({ relationshipTable, tableArray })
      .filter(function(document) { return document('language')('key').eq(languageDocumentKey) })
      .getField('article')
      .coerceTo('array')
      .run(databaseConnection);
  return result
}

export async function documentRelatedToAggregation({ // all documents of an article
  databaseConnection,
  aggregatedArticleKey
}) {
  let article = r.db('webappContent').table('article');
  let version = 
    aggregation({ table: article, aggregatedDocumentKey: aggregatedArticleKey })
    .coerceTo('array')
    .run(databaseConnection);
  return version
}