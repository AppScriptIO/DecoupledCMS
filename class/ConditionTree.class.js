import NestedUnitImplementation from './NestedUnitImplementation.class.js'
import Condition from './Condition.class.js'
import r from 'rethinkdb'
import getAllConditionTree from '../utilityFunction/database/query/getAllConditionTree.query.js'
import getConditionTreeQuery from '../utilityFunction/database/query/getConditionTree.query.js'
import promiseProperRace from '../utilityFunction/promiseProperRace.js'

const self = class ConditionTree extends NestedUnitImplementation {
    
    static getDocumentQuery = getConditionTreeQuery

    constructor(conditionTreeKey) {
        super(true)
        return this
    }

    async initializeInsertionPoint(insertionPoint, conditionTreeController) {
        let callback = false;
        // [1] get children immediate & relating to this insertion position.
        let filteredChildren = this.children.filter(object => { // filter children that correspont to the current insertionpoint.
            return (object.insertionPointKey == insertionPoint.key && object.treePath == null)
        })
        // [2] check type of subtrees execution: race first, all ... .
        let executionTypeCallbackName;
        switch(insertionPoint.executionType) {
            case 'raceFirstPromise': 
                executionTypeCallbackName = 'initializeConditionTreeInRaceExecutionType'
                break;
            default: 
                console.log('executionType doesn\'t match any kind.')
        }

        // [3] call handler on them.
        callback = this[executionTypeCallbackName](filteredChildren, conditionTreeController)
        // [4] return callback
        return callback
    }

    async initializeConditionTreeInRaceExecutionType(conditionTreeChildren, conditionTreeController) {
        let promiseArray = []
        promiseArray = conditionTreeChildren.map((conditionTreeChild) => {
            return new Promise(async (resolve, reject) => {
                let callback = await conditionTreeController.initializeConditionTree(conditionTreeChild.key, conditionTreeController.AppInstance)
                if(!callback) reject('SZN - No callback choosen from this childTree.')
                resolve(callback)
            })
        })

        let callback;
        await promiseProperRace(promiseArray).then((promiseReturnValueArray) => {
            callback = promiseReturnValueArray[0] // as only one promise is return in the array.
        }).catch(reason => console.log(`🔀⚠️ promiseProperRace rejected because: ${reason}`))
        return callback
    } 
    
}

export default self
