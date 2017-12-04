import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    NestedUnit: getTableDocumentCurried({ documentId: 'condition_conditionTree' }),
}
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['NestedUnit'] ]
        })
        @extendedSubclassPattern.Subclass()
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
                    // [1] get children immediate & relating to this insertion position.
                    let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                
                    // let children = await this.filterChildrenOfCurrentInsertionPoint({ insertionPointKey: insertionPoint.key })
                    returnedValue = await this.initializeInsertionPoint({ insertionPoint, children })
                    if (returnedValue) break
                }
                return returnedValue;
            }
            
        }
            
    return self
}