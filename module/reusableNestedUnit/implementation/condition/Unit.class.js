import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    Unit: getTableDocumentCurried({ documentId: 'condition_conditionImplementation' }),
    File: getTableDocumentCurried({ documentId: 'condition_valueReturningFile' }),
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
            async checkCondition() {
                let valueReturningFileKey = this.valueReturningFileKey
                if(!('valueReturningFile' in this)) {
                    this.valueReturningFile = await getDocument['File']({ 
                        key: valueReturningFileKey,
                        connection: self.rethinkdbConnection
                    })
                }
                // [2] require & check condition
                if(!this.conditionResult) {
                    let expectedReturn = this.expectedReturn
                    let filePath = this.valueReturningFile.filePath
                    let returnedValue = await require(filePath)(this.portAppInstance)
                    if(process.env.SZN_DEBUG == 'true' && this.portAppInstance.context.headers.debug == 'true') console.log(`🔀 Comparing conditionKey: ${this.key} ${filePath}. \n • expected: ${expectedReturn} == ${returnedValue}. \n • compare result: ${(returnedValue == expectedReturn)} \n \n`)
                    this.conditionResult = (returnedValue == expectedReturn) ? true : false;            
                }
                return  this.conditionResult
            }
        }
    
    return self
}