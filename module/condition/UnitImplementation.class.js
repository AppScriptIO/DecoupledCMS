const ModuleClassContext = require('appscript/module/ModuleClassContext')
import getTableDocument from 'appscript/utilityFunction/database/query/getTableDocument.query.js'
const getValueReturningFile = getTableDocument('valueReturningFile')

module.exports = new ModuleClassContext((methodInstanceName, superclass) => {
    const self = class UnitImplementation extends superclass {
        async checkCondition() {
            // [1] get valueReturningFile
            let valueReturningFileKey = await this.valueReturningFileKey
            if(!('valueReturningFile' in this)) {
                this.valueReturningFile = await getValueReturningFile(self.rethinkdbConnection, valueReturningFileKey)
            }
            // [2] require & check condition
            if(!this.conditionResult) {
                let expectedReturn = this.expectedReturn
                let filePath = this.valueReturningFile.filePath
                let returnedValue = await require(filePath)(this.AppInstance)
                console.log(`🔀 conditionKey: ${this.key} ${filePath}. expected: ${expectedReturn} == ${returnedValue}. compare: ${(returnedValue == expectedReturn)}`)
                this.conditionResult = (returnedValue == expectedReturn) ? true : false;            
            }
            return  this.conditionResult
        }
    }
    self.initializeStaticClass(getTableDocument('conditionImplementation'))
})