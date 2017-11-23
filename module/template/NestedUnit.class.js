// import { Condition } from 'appscript/module/condition'
import r from 'rethinkdb'
import _ from 'underscore'
import filesystem from 'fs'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['template_viewNestedUnit'] = getTableDocument.generate('template_viewNestedUnit')
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

module.exports = superclass => {
    let self = class NestedUnit extends superclass {

        // static getDocumentQuery(connection, conditionTreeKey) {
        //     getConditionTreeQuery(connection, conditionTreeKey)
        // }

        // static createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback) {
        //     NestedUnitImplementation.createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback)
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
                    if(!(insertionPoint.name in view)) view[insertionPoint.name] = []
                    Array.prototype.push.apply( view[insertionPoint.name], await this.initializeInsertionPoint({ insertionPoint }) )
                }
            }
            return view;
        }

        async initializeInsertionPoint({insertionPoint}) {
            // [1] get children immediate & relating to this insertion position.
            let filteredChildren = this.children.filter(object => { // filter children that correspont to the current insertionpoint.
                return (object.insertionPosition.insertionPoint == insertionPoint.key && object.insertionPosition.insertionPathPointer == null)
            })
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
            return await this[executionTypeCallbackName](filteredChildren)
        }

        async initializeTreeInChronologicalSequence(treeChildren) {
            let renderedStringArray = []
            for (var index = 0; index < treeChildren.length; index++) {
                let treeChild = treeChildren[index]
                let controllerInstancePrototype = this.__proto__.__proto__.__proto__
                // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                if(this.children.length != 0) {
                    await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                } else {
                    this.children = await this.additionalChildNestedUnit.slice()
                }
                let subsequentRenderedTemplate = [
                    await this.initializeNestedUnit({
                        nestedUnitKey: treeChild.nestedUnit,
                        controllerInstance: controllerInstancePrototype,
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
    self.initializeStaticClassControllerLevel(getTableDocument.instance['template_viewNestedUnit'])

    self.prototype.meta = {
        description: 'TemplateNestedUnit prototype object'
    }
    self = new Proxy(self, {
        construct: function(target, argumentsList, newTarget) {
            let instance = newTarget(...argumentsList)
            instance.meta = {
                description: 'TemplateNestedUnit instance/object'
            }
            return instance 
        },
        apply: function(target, thisArg, argumentsList) {
            let instance = target.call(thisArg, ...argumentsList)
            instance.meta = {
                description: 'TemplateNestedUnit instance/object'
            }
            return instance
        }
    });
    return self
}