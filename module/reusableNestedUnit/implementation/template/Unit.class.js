import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
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
            // get valueReturningFile and set needed properties on this.
            async pupolateTemplateFile() {
                if (!('templateFilePath' in this)) {
                    let templateFile = await getDocument['File']({ 
                        key: this.templateFile,
                        connection: self.rethinkdbConnection
                    })
                    this.templateFilePath = templateFile.filePath
                }
            }
        }
    
    return self
}