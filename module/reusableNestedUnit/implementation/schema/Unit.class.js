import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let databasePrefix = 'schema_'
let getDocument = {
    'Unit': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}unit` }),
    'File': getTableDocumentCurried({ databaseName: 'webappSetting', tableName: `${databasePrefix}file` }),
}

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['Unit'] ]
        })
        @extendedSubclassPattern.Subclass()
        class Unit extends Superclass {
            async pupolateUnitWithFile() {
                await super.pupolateUnitWithFile({
                    getDocument: getDocument['File'],
                    fileKey: this.fileKey,
                    extract: { destinationKey: 'file' }
                })
            }

            async resolveDataset({ parentResult = null }) {
                // [2] require & check condition
                let dataset;
                let filePath = this.file.filePath
                dataset = await require(filePath)({
                    portClassInstance: this.portAppInstance, // contains also portClassInstance.context of the request. 
                    args: this.args,
                    parentResult, // parent dataset result.
                })
                return dataset
            }

        }
    return self
}