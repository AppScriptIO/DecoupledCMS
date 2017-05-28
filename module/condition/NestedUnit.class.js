const ModuleClassContext = require('appscript/module/ModuleClassContext')
import r from 'rethinkdb'

import getTableDocument from 'appscript/utilityFunction/database/query/getTableDocument.query.js'
const getAllConditionTree = getTableDocument('conditionTree')
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

module.exports = new ModuleClassContext((methodInstanceName, superclass) => {
    const self = class NestedUnit extends superclass {
        // static getDocumentQuery(connection, conditionTreeKey) {
        //     getConditionTreeQuery(connection, conditionTreeKey)
        // }

        // static createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback) {
        //     NestedUnitImplementation.createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback)
        // }

        async initializeInsertionPoint({insertionPoint}) {
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
            callback = this[executionTypeCallbackName](filteredChildren)
            // [4] return callback
            return callback
        }
        
        async initializeConditionTreeInRaceExecutionType(conditionTreeChildren) {
            let promiseArray = []
            promiseArray = conditionTreeChildren.map((conditionTreeChild) => {
                return new Promise(async (resolve, reject) => {
                    let controllerInstancePrototype = this.__proto__.__proto__.__proto__
                    let callback = await this.initializeConditionTree({nestedUnitKey: conditionTreeChild.key, controllerInstance: controllerInstancePrototype})
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
    self.initializeStaticClass(getTableDocument('conditionTree'))
})