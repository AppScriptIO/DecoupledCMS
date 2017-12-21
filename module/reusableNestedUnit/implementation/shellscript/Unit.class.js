import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import { exec, execSync, spawn, spawnSync } from 'child_process'

let databasePrefix = 'shellscript_'
let getDocument = {
    'Unit': getTableDocumentCurried({ documentId: `${databasePrefix}unit` })
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
                let message = ` _____                          _        
| ____|__  __ ___   ___  _   _ | |_  ___ 
|  _|  \\ \\/ // _ \\ / __|| | | || __|/ _ \\
| |___  >  <|  __/| (__ | |_| || |_|  __/    
|_____|/_/\\_\\\\___| \\___| \\__,_| \\__|\\___|`;
                let childProcess;
                switch (this.implementation) {
                    case 'spawn':
                        try {
                            console.log(message); console.log(`${this.command} ${this.argument}`)
                            childProcess = spawnSync(this.command, this.argument, this.option)
                            if(childProcess.status > 0) throw childProcess.error
                        } catch (error) {
                            process.exit(childProcess.status)
                        }
                    break;
                    case 'spawnAsynchronous':
                        try {
                            console.log(message); console.log(`${this.command} ${this.argument}`)                            
                            childProcess = spawn(this.command, this.argument, this.option)
                            if(childProcess.status > 0) throw childProcess.error
                        } catch (error) {
                            process.exit(childProcess.status)
                        }
                    break;
                    case 'file':
                        try {
                            console.log(message); console.log(`shellscript file: ${this.filename}, shellscriptPath: ${this.shellscriptPath}`)                            
                            this.option.cwd = this.shellscriptPath
                            execSync(`sh ${this.filename}`, this.option)
                        } catch (error) {
                            throw error
                            process.exit(1)
                        }
                    break;
                    default:
                        console.log('shellscriptUnit.implementation does not match any option.')
                    break;
                }
                // important to prevent 'unable to re-open stdin' error between shells.
                await new Promise(resolve => setTimeout(resolve, 500)) // wait x seconds before next script execution.
            }
        }
    return self
}