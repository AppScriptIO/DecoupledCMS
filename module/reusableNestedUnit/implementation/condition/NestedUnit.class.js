import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute } from 'appscript/utilityFunction/decoratorUtility.js'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['condition_conditionTree'] = getTableDocument.generate('condition_conditionTree')
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

export default ({ Superclass }) => {
    let self = 
        @prototypeChainDebug
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getTableDocument.instance['condition_conditionTree'] ] 
        })
        class NestedUnit extends Superclass {
            // static getDocumentQuery(connection, conditionTreeKey) {
            //     getConditionTreeQuery(connection, conditionTreeKey)
            // }

            // static createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback) {
            //     NestedUnit.createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback)
            // }

            /**
             * @description loops through all the insertion points and initializes each one to execute the children specific for it.
             * 
             * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
             * @returns undifiend for false or any type of value depending on the module being applied.
             */
            async loopInsertionPoint() {
                let returnedValue;
                // get callback from subtrees
                for (let insertionPoint of this.insertionPoint) {
                    returnedValue = await this.initializeInsertionPoint({ insertionPoint })
                    if (returnedValue) break
                }
                return returnedValue;
            }

            async initializeInsertionPoint({insertionPoint}) {
                let callback;
                // [1] get children immediate & relating to this insertion position.
                let filteredTreeChildren = await this.filterChildren({ insertionPointKey: insertionPoint.key })
                // Take into consideration the indirect children added from previous (inhereted) trees.
                // filteredTreeChildren + immediateNextChildren
                // let nextChildren;
                
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
                callback = await this[executionTypeCallbackName](filteredTreeChildren)
                // [4] return callback
                return callback ? callback : false;
            }
            
            async initializeConditionTreeInRaceExecutionType(conditionTreeChildren) {
                let promiseArray = []
                promiseArray = conditionTreeChildren.map(conditionTreeChild => {
                    return new Promise(async (resolve, reject) => {
                        // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                        
                        if(this.children.length != 0) {
                            await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                        } else {
                            this.children = await this.additionalChildNestedUnit.slice()
                        }

                        let callback = await this.initializeConditionTree({
                            nestedUnitKey: conditionTreeChild.nestedUnit, 
                            additionalChildNestedUnit: this.children,
                            pathPointerKey: conditionTreeChild.pathPointerKey
                        })
                        if(!callback) reject('SZN - No callback choosen from this childTree.')
                        resolve(callback)
                    })
                })

                let callback;
                await promiseProperRace(promiseArray).then((promiseReturnValueArray) => {
                    callback = promiseReturnValueArray[0] // as only one promise is return in the array.
                }).catch(reason => { if(process.env.SZN_DEBUG == 'true' && this.AppInstance.context.headers.debug == 'true') console.log(`🔀⚠️ promiseProperRace rejected because: ${reason}`) })
                return callback ? callback : false;
            }

        }
            
    return self
}