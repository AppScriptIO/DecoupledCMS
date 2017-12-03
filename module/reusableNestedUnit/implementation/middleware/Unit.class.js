import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    'Unit': getTableDocumentCurried({ documentId: 'middleware_middlewareImplementation' }),
    'File': getTableDocumentCurried({ documentId: 'middleware_middlewareFile' }),
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
            async pupolateMiddlewareFile() {
                let middlewareFileKey = this.middlewareFile
                if (!('functionPath' in this)) {
                    let middlewareFile = await getDocument['File']({
                        key: middlewareFileKey,
                        connection: self.rethinkdbConnection
                    })
                    this.functionPath = middlewareFile.filePath
                }
            }
        }
    return self
}