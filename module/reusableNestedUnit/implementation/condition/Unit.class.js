import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['condition_valueReturningFile'] = getTableDocument.generate('condition_valueReturningFile')
getTableDocument.instance['condition_conditionImplementation'] = getTableDocument.generate('condition_conditionImplementation')

module.exports = ({ superclass }) => {
    let self = class Unit extends superclass {
        async checkCondition() {
            // [1] get valueReturningFile
            let valueReturningFileKey = this.valueReturningFileKey
            if(!('valueReturningFile' in this)) {
                this.valueReturningFile = await getTableDocument.instance['condition_valueReturningFile'](self.rethinkdbConnection, valueReturningFileKey)
            }
            // [2] require & check condition
            if(!this.conditionResult) {
                let expectedReturn = this.expectedReturn
                let filePath = this.valueReturningFile.filePath
                let returnedValue = await require(filePath)(this.AppInstance)
                if(process.env.SZN_DEBUG == 'true' && this.AppInstance.context.headers.debug == 'true') console.log(`🔀 Comparing conditionKey: ${this.key} ${filePath}. \n • expected: ${expectedReturn} == ${returnedValue}. \n • compare result: ${(returnedValue == expectedReturn)} \n \n`)
                this.conditionResult = (returnedValue == expectedReturn) ? true : false;            
            }
            return  this.conditionResult
        }
    }
    self.initializeStaticClassControllerLevel(getTableDocument.instance['condition_conditionImplementation'])
    
    self = prototypeChainDebug(self)
    
    return self
}