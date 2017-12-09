import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    NestedUnit: getTableDocumentCurried({ documentId: 'shellscript_nestedUnit'})
}

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['NestedUnit'] ] 
        })
        @extendedSubclassPattern.Subclass()            
        class NestedUnit extends Superclass {
        }
    
    return self
}