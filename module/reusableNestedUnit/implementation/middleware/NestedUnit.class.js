import r from 'rethinkdb'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['condition_conditionTree'] = getTableDocument.generate('condition_conditionTree')
getTableDocument.instance['middleware_middlewareNestedUnit'] = getTableDocument.generate('middleware_middlewareNestedUnit')

import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

module.exports = ({ superclass }) => {
    let self = class NestedUnit extends superclass {

        constructor() {
            return super(...arguments)
        }

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
            let middlewareArray = []
            // get callback from subtrees
            if(this.insertionPoint) {
                for (let insertionPoint of this.insertionPoint) {
                    let subsequentMiddleware = await this.initializeInsertionPoint({ insertionPoint })
                    if(middlewareArray.length != 0) {
                        await Array.prototype.push.apply(middlewareArray, subsequentMiddleware)
                    } else {
                        middlewareArray = await subsequentMiddleware.slice()
                    }
                }
            }
            return middlewareArray;
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
                case 'middlewareArray': 
                    executionTypeCallbackName = 'returnMiddlewareArray'
                break;
                default: 
                    console.log(`"${insertionPoint.executionType}" executionType doesn\'t match any kind.`)
            }
            // [3] call handler on them.
            return await this[executionTypeCallbackName](filteredChildren)
        }

        async initializeTreeInChronologicalSequence(treeChildren) {
        }

        async returnMiddlewareArray(treeChildren) {
            let middlewareArray = []
            for (var index = 0; index < treeChildren.length; index++) {
                let treeChild = treeChildren[index]
                // console.log(this.__proto__.__proto__.__proto__)
                let controllerInstancePrototype = this.__proto__.__proto__.__proto__
                // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                if(this.children.length != 0) {
                    await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                } else {
                    this.children = await this.additionalChildNestedUnit.slice()
                }
                let subsequentMiddleware = await this.initializeNestedUnit({
                    nestedUnitKey: treeChild.nestedUnit,
                    controllerInstance: controllerInstancePrototype,
                    additionalChildNestedUnit: this.children,
                    pathPointerKey: treeChild.pathPointerKey
                })
                if(middlewareArray.length != 0) {
                    await Array.prototype.push.apply(middlewareArray, subsequentMiddleware)
                } else {
                    middlewareArray = await subsequentMiddleware.slice()
                }
            }

            return middlewareArray
        } 
    }
    self.initializeStaticClassControllerLevel(getTableDocument.instance['middleware_middlewareNestedUnit'])
    self = prototypeChainDebug(self)
    
    return self
}