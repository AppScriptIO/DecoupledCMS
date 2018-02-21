import r from 'rethinkdb'

/** 
 * parent has type "aggregation" with array of all related versions in property "version"
 * returns RethinkDB sequence of related version for specific document aggregation.
*/
export function aggregation({
    table,
    aggregatedDocumentKey
}) {
    let aggregatedDocument = table.filter({ key: aggregatedDocumentKey });

    let version =
        aggregatedDocument
        .concatMap(function(document) {
            return document('version')
        })
        .concatMap(function(document) {
            let related = table.getAll(document, { index: 'key' });
            return related
        })
    
        return table
}

/**
 * relationship table matching two documents from different tables to create multiple-to-multiple relationship
 *  
 */
export function multipleRelationship({ 
    relationshipTable,
    tableArray = [/* { name, table } */]
 }) {
    let relationshipSequence = relationshipTable.map(function(document) { return { relationship: document } }) // create field "relationship" with details of the relation (formatting)
    for (let table of tableArray) {
        relationshipSequence = 
            relationshipSequence
            .concatMap(document => {
                let comparingKey;
                comparingKey = r.branch( // check if nested field present i.e. document.relationship.<tableName>
                    document.hasFields({'relationship': {[table['name']]: true}}), document('relationship')(table['name'])('documentKey'), // if condition and value.
                    [] // else value
                )
                let related = table['table'].getAll(
                    comparingKey,
                    { index: 'key' }
                )
                return related.map(relatedDocument => {
                    return document.merge({ [table['name']]: relatedDocument })
                })
            })
    }
    return relationshipSequence
}
