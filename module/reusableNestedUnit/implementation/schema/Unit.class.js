import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let databasePrefix = 'schema_'
let getDocument = {
    'Unit': getTableDocumentCurried({ documentId: `${databasePrefix}unit` }),
    'File': getTableDocumentCurried({ documentId: `${databasePrefix}file` }),
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

            @executeOnceForEachInstance()                        
            async resolveDataset() {
                // [2] require & check condition
                if(!this.dataset) {
                    let filePath = this.file.filePath
                    this.dataset = await require(filePath)(this.portAppInstance)
                }
                return  this.dataset
            }

        }
    return self
}