import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    Unit: getTableDocumentCurried({ documentId: 'template_viewImplementation' }),
    File: getTableDocumentCurried({ documentId: 'template_templateFile' })
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
            async pupolateUnitWithFile() { // get valueReturningFile and set needed properties on this.
                await super.pupolateUnitWithFile({
                    getDocument: getDocument['File'],
                    fileKey: this.templateFile,
                    extract: { sourceKey: 'filePath', destinationKey: 'templateFilePath' }
                })
            }
        }
    
    return self
}