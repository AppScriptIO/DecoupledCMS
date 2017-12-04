// import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import _ from 'underscore'
import filesystem from 'fs'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'
import { curried as getTableDocumentCurried } from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getDocument = {
    Unit: getTableDocumentCurried({ documentId: 'template_viewNestedUnit' }),
}

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })  
        @execute({ 
            staticMethod: 'initializeStaticClass', 
            args: [ getDocument['Unit'] ]
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
                let view = {}
                if(this.insertionPoint) {
                    for (let insertionPoint of this.insertionPoint) {
                        let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                                        
                        if(!(insertionPoint.name in view)) view[insertionPoint.name] = []
                        Array.prototype.push.apply( 
                            view[insertionPoint.name],
                            await this.initializeInsertionPoint({ insertionPoint, children }) 
                        )
                    }
                }
                return view;
            }

            async initializeInsertionPoint({ insertionPoint, children }) {

                // [2] check type of subtrees execution: race first, all ... .
                let executionTypeCallbackName;
                switch(insertionPoint.executionType) {
                    case 'chronological': 
                        executionTypeCallbackName = 'initializeTreeInChronologicalSequence'
                    break;
                    default: 
                        console.log(`"${insertionPoint.executionType}" executionType doesn\'t match any kind (in function called initializeInsertionPoint of NestedUnit.class.js file).`)
                }
                // [3] call handler on them & and return rendered template array corresponding to the specifc insertionPoint.
                return await this[executionTypeCallbackName](children)
            }

            async initializeTreeInChronologicalSequence(treeChildren) {
                let renderedStringArray = []
                for (var index = 0; index < treeChildren.length; index++) {
                    let treeChild = treeChildren[index]
                    // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                    if(this.children.length != 0) {
                        await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                    } else {
                        this.children = await this.additionalChildNestedUnit.slice()
                    }
                    let subsequentRenderedTemplate = [
                        await this.initializeNestedUnit({
                            nestedUnitKey: treeChild.nestedUnit,
                            additionalChildNestedUnit: this.children,
                            pathPointerKey: treeChild.pathPointerKey
                        })
                    ]
                    if(renderedStringArray.length != 0) {
                        await Array.prototype.push.apply(renderedStringArray, subsequentRenderedTemplate)
                    } else {
                        renderedStringArray = await subsequentRenderedTemplate.slice()
                    }
                }

                return renderedStringArray
            }

        }
    
    return self
}