import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import r from 'rethinkdb'

export default async function({ portClassInstance, parentResult }) {
    let connection = portClassInstance.constructor.rethinkdbConnection
    let context = portClassInstance.context
    let parameter = context.request.query
    let databaseName = 'webappContent'

    // extract parameters
    let aggregatedKey = parameter.key
    let languageDocumentKey = parameter.language
    
    var article = r.db('webappContent').table('article');
    let language = r.db('webappContent').table('language');
    let aggregatedArticle = article.filter({ key: aggregatedKey });

    let version =
      aggregatedArticle
        .concatMap(function(document) {
          return document('version')
        })
        .concatMap(function(document) {
          let related = article.getAll(document, {index: 'key'});
          return related
        });
    
    let result = await
      r.db('webappContent').table('relationship')
        .map(function(document) { return { relationship: document } })
        .concatMap(function(document) {
          let related = article.getAll(document('relationship')('article')('documentKey'), { index: 'key' });
          return related.map(function(relatedDocument) {
            return document.merge({ article: relatedDocument })
          })
        })
        .concatMap(function(document) {
          let related = language.getAll(document('relationship')('language')('documentKey'), { index: 'key' });
          return related.map(function(relatedDocument) {
            return document.merge({ language: relatedDocument })
          })
        })
        .filter(function(document) { return document('language')('key').eq(languageDocumentKey) })
        .filter(function(document) {
          return version.contains(function(version) {
            return document('article')('key').eq(version('key'))
          })
        })
        .getField('article')
        .coerceTo('array')
        .run(connection);
    
    return result

  }