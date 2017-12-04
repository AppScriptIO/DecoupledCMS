import r from 'rethinkdb'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    NestedUnit: getTableDocumentCurried({ documentId: 'middleware_middlewareNestedUnit'})
}

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
                let array = []
                // get callback from subtrees
                if(this.insertionPoint) {
                    for (let insertionPoint of this.insertionPoint) {
                        let children = await this.filterChildrenOfCurrentInsertionPoint({
                            insertionPointKey: insertionPoint.key,
                            children: this.children
                        })
                        let subsequentArray = await this.initializeInsertionPoint({ insertionPoint, children })
                        if(array.length != 0) {
                            await Array.prototype.push.apply(array, subsequentArray)
                        } else {
                            array = await subsequentArray.slice()
                        }
                    }
                }
                return array;
            }

            async initializeInsertionPoint({ insertionPoint, children }) {
                // [2] check type of subtrees execution: race first, all ... .
                let callback;
                switch(insertionPoint.executionType) { // execution type callback name
                    case 'chronological': 
                        callback = 'initializeTreeInChronologicalSequence'
                    break;
                    case 'middlewareArray': 
                        callback = 'returnMiddlewareArray'
                    break;
                    default: 
                        console.log(`"${insertionPoint.executionType}" executionType doesn\'t match any kind.`)
                }
                // [3] call handler on them.
                return await this[callback](children)
            }

            async initializeTreeInChronologicalSequence(treeChildren) {
            }

            async returnMiddlewareArray(treeChildren) {
                let middlewareArray = []
                for (var index = 0; index < treeChildren.length; index++) {
                    let treeChild = treeChildren[index]
                    // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                    if(this.children.length != 0) {
                        await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                    } else {
                        this.children = await this.additionalChildNestedUnit.slice()
                    }
                    let subsequentArray = await this.initializeNestedUnit({
                        nestedUnitKey: treeChild.nestedUnit,
                        additionalChildNestedUnit: this.children,
                        pathPointerKey: treeChild.pathPointerKey
                    })
                    if(middlewareArray.length != 0) {
                        await Array.prototype.push.apply(middlewareArray, subsequentArray)
                    } else {
                        middlewareArray = await subsequentArray.slice()
                    }
                }

                return middlewareArray
            } 
        }
    
    return self
}