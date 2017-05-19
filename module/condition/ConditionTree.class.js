const ModuleClassContext = require('appscript/module/ModuleClassContext')
import { NestedUnitImplementation as NestedUnitImplementationModule } from 'appscript/module/reusableNestedUnit'
const NestedUnitImplementation = NestedUnitImplementationModule.getMethodInstance()
import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import getAllConditionTree from 'appscript/utilityFunction/database/query/getAllConditionTree.query.js'
import getConditionTreeQuery from 'appscript/utilityFunction/database/query/getConditionTree.query.js'
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

module.exports = new ModuleClassContext((superclass = Application) => {
    const self = class ConditionTree extends NestedUnitImplementation {
        constructor(conditionTreeKey) {
            super(true)
            this.key = conditionTreeKey
            return this
        }
        static getDocumentQuery = getConditionTreeQuery
        // static getDocumentQuery(connection, conditionTreeKey) {
        //     getConditionTreeQuery(connection, conditionTreeKey)
        // }

        // static createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback) {
        //     NestedUnitImplementation.createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback)
        // }
        static initializeStaticClass() {
            self.eventEmitter.on('initializationEnd', () => {
                let ClassObject = {}
                ClassObject[`${self.name}`] = self
                self.addStaticSubclassToClassArray(ClassObject)
            })
        }
        async initializeConditionTree() {
            if(!('jsonData' in this)) { // if not already populated with data.
                let jsonData = await self.getDocumentQuery(self.rethinkdbConnection, this.key)
                await this.populateInstancePropertyFromJson_this(jsonData)
            }
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
    self.initializeStaticClass()
})