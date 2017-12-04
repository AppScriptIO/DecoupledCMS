// import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import _ from 'underscore'
import filesystem from 'fs'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
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

        }
    
    return self
}