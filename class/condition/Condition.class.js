import Unit from '../Unit.class.js'
import getCondition from '../../utilityFunction/database/query/getCondition.query.js'
import getValueReturningFile from '../../utilityFunction/database/query/getValueReturningFile.query.js'

const self = class Condition extends Unit {

    static getDocumentQuery = getCondition
    
    constructor(conditionKey) {
        super(true)
        return this
    }
    
    async checkCondition(AppInstance) {
        // [1] get valueReturningFile
        let valueReturningFileKey = await this.valueReturningFileKey
        if(!('valueReturningFile' in this)) {
            this.valueReturningFile = await getValueReturningFile(self.rethinkdbConnection, valueReturningFileKey)
        }
        // [2] require & check condition
        if(!this.conditionResult) {
            let expectedReturn = this.expectedReturn
            let filePath = this.valueReturningFile.filePath
            let returnedValue = await require(filePath)(AppInstance)
            console.log(`🔀 conditionKey: ${this.key} ${filePath}. expected: ${expectedReturn} == ${returnedValue}. compare: ${(returnedValue == expectedReturn)}`)
            this.conditionResult = (returnedValue == expectedReturn) ? true : false;            
        }
        return  this.conditionResult
    }
}

export default self