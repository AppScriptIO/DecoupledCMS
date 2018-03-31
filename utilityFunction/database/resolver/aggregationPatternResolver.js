/** Non default exports are used for server side requests, bypassing the schema nested unit module */
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import r from 'rethinkdb'
import { aggregation, multipleRelationship, getSingleDocumentOfSpecificLanguage, getMergedMultipleDocumentOfSpecificLanguage, getMultipleDocumentVersionOfSpecificLanguage, documentRelatedToAggregation } from 'appscript/utilityFunction/database/query/patternImplementation.js'

export default function({} = {}) {
    return async function resolver({ portClassInstance, parentResult, args }) {
        let databaseConnection = portClassInstance.constructor.rethinkdbConnection
        let context = portClassInstance.context
        let parameter = context.request.query
        let databaseName = 'webappContent'
        const dataTableName = args.databaseTable // from nestedUnit file/extension.
    
        // extract parameters of url
        let dataAggregatedKey = parameter.key
        let languageDocumentKey = parameter.language
        let option = parameter.option
        
        let result;
        if(dataAggregatedKey && languageDocumentKey) {
            result = await getSingleDocumentOfSpecificLanguage({ databaseConnection, dataAggregatedKey, languageDocumentKey, dataTableName})
        } else if(!dataAggregatedKey && languageDocumentKey) {
            switch (option) {
                case 'merged':
                    result = await getMergedMultipleDocumentOfSpecificLanguage({ dataTableName, languageDocumentKey, databaseConnection })
                break;
                default:
                    result = await getMultipleDocumentVersionOfSpecificLanguage({ databaseConnection, languageDocumentKey, dataTableName })
                break;
            }
        } else if(dataAggregatedKey && !languageDocumentKey) {
            result = await documentRelatedToAggregation({ databaseConnection, dataAggregatedKey, dataTableName })
        }

        return result
    }
}