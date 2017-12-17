// import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import _ from 'underscore'
import filesystem from 'fs'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let databasePrefix = 'template_'
let getDocument = {
    NestedUnit: getTableDocumentCurried({ documentId: `${databasePrefix}nestedUnit` }),
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