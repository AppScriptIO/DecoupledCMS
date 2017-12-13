import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import { exec, spawn, spawnSync } from 'child_process'

let getDocument = {
    'Unit': getTableDocumentCurried({ documentId: 'shellscript_unit' })
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
            async executeScript() {
                switch (this.implementation) {
                    case 'spawn':
                        let message = ` _____                          _        
| ____|__  __ ___   ___  _   _ | |_  ___ 
|  _|  \\ \\/ // _ \\ / __|| | | || __|/ _ \\
| |___  >  <|  __/| (__ | |_| || |_|  __/    
|_____|/_/\\_\\\\___| \\___| \\__,_| \\__|\\___|
${this.command} ${this.argument}`;
                        console.log(message)
                        spawnSync(this.command, this.argument, this.option)
                    break;
                    default:
                        console.log('shellscriptUnit.implementation does not match any option.')
                    break;
                }
            }
        }
    return self
}