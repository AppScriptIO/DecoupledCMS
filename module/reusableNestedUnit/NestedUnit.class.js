import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import promiseProperRace from 'appscript/utilityFunction/promiseProperRace.js'

export default ({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
    class RNestedUnit extends Superclass {

        static getDocumentQuery;

        static initializeStaticClass(self, getDocument) {
            // console.log(getDocument)
            self.getDocumentQuery = getDocument
        }

        constructor(databaseDocumentKey) {
            super()
            this.key = databaseDocumentKey
            return this
        }
        
        /**
         * @description loops through all the insertion points and initializes each one to execute the children specific for it.
         * 
         * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
         * @returns undifiend for false or any type of value depending on the module being applied.
         */
        /**
         * @description loops through all the insertion points and initializes each one to execute the children specific for it.
         * 
         * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
         * @returns undifiend for false or any type of value depending on the module being applied.
         */
        async loopInsertionPoint({ type }) {
            switch (type) {
                case 'aggregateIntoObject':
                    let view = {}
                    if(this.insertionPoint) {
                        for (let insertionPoint of this.insertionPoint) {
                            let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                                        
                            let subsequent = await this.initializeInsertionPoint({ insertionPoint, children })                        
                            if(!(insertionPoint.name in view)) view[insertionPoint.name] = []
                            Array.prototype.push.apply( 
                                view[insertionPoint.name],
                                subsequent 
                            )
                        }
                    }
                    return view;                        
                break;
                case 'aggregateIntoArray':
                    let array = []
                    if(this.insertionPoint) { // get callback from subtrees
                        for (let insertionPoint of this.insertionPoint) {
                            let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                                        
                            let subsequentArray = await this.initializeInsertionPoint({ insertionPoint, children })
                            if(array.length != 0) {
                                await Array.prototype.push.apply(array, subsequentArray)
                            } else {
                                array = await subsequentArray.slice()
                            }
                        }
                    }
                    return array;
                break;
                /**
                 * @description loops through all the insertion points and initializes each one to execute the children specific for it.
                 * 
                 * @param {Class Instance} nestedUnitInstance Tree instance of the module using "reusableNestedUnit" pattern. instance should have "initializeInsertionPoint" function & "insertionPoint" Array.
                 * @returns undifiend for false or any type of value depending on the module being applied.
                 */
                case 'returnedFirstValue':
                    let returned;
                    // get callback from subtrees
                    for (let insertionPoint of this.insertionPoint) {
                        // [1] get children immediate & relating to this insertion position.
                        let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                
                        // let children = await this.filterChildrenOfCurrentInsertionPoint({ insertionPointKey: insertionPoint.key })
                        returned = await this.initializeInsertionPoint({ insertionPoint, children })
                        if (returned) break
                    }
                    return returned;
                break;
                case 'executeScript':
                    for (let insertionPoint of this.insertionPoint) {
                        // [1] get children immediate & relating to this insertion position.
                        let children = await this.filterAndOrderChildren({ insertionPointKey: insertionPoint.key })                
                        // let children = await this.filterChildrenOfCurrentInsertionPoint({ insertionPointKey: insertionPoint.key })
                        await this.initializeInsertionPoint({ insertionPoint, children })
                    }
                break;
                default:
                    console.log(`"${type}" type doesn\'t match any kind.`)
                break;
            }
        }

        /**
         * @description gets document from database using documentKey and populates the data to the instance.
         * 
         */
        async reflectDatabaseDataToAppObject() {
            await super.reflectDatabaseDataToAppObject()
            // reorder insertion points
            if(!('jsonData' in this) && this.insertionPoint) {
                await this.insertionPoint.sort((prior, subsequent) => {
                    return (prior.order <= subsequent.order) ? -1 : 1;
                })
            }
        }
        
        /**
         * @description filters & modifies array by removing truthy indexes.
         * 
         * @param {any} {insertionPointKey, insertionPath = null} 
         * @returns 
         */
        async filterAndOrderChildren({ insertionPointKey, children = this.children }) {
            let ownFilteredChildren = await this.filterAndModifyChildrenArray(children, insertionPointKey, null)
            let additionalFilteredChildren = await this.filterAndModifyChildrenArray(this.additionalChildNestedUnit, insertionPointKey, this.pathPointerKey)
            return await this.mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren);
        }
        /**
         * Get children corresponding to the current insertion point.
         * // Take into consideration the indirect children added from previous (inhereted) trees.
         * // filteredTreeChildren + immediateNextChildren
         * // let nextChildren;
         */
        async filterAndModifyChildrenArray(children, insertionPointKey, pathPointerKey) {
            return children.filter((child, index) => { // filter children that correspont to the current insertionpoint.
                let result = (
                    child.insertionPosition.insertionPoint == insertionPointKey &&
                    child.insertionPosition.insertionPathPointer == pathPointerKey
                )
                // if (result) children.splice(index, 1); // was ment to increase the performance of the program, preventing rechecking of already checked array items. But it causes some issues.
                return result
            })
        }
        // order additional children that will be mixed into ownChildren. According to a setting that needs to be added into each child object.
        async mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren) {
            // metrge 2 arrays., appending one to the other.
            // let filteredChildren = []
            // await Array.prototype.push.apply(filteredChildren, ownFilteredChildren, additionalFilteredChildren);
            let firstChildren = [],
                lastChildren = [],
                orderedChildren = []
            await additionalFilteredChildren.sort((prior, subsequent) => {
                return (prior.order <= subsequent.order) ? 1 : -1;
            })
            await ownFilteredChildren.sort((prior, subsequent) => {
                return (prior.order <= subsequent.order) ? 1 : -1;
            })
            additionalFilteredChildren = additionalFilteredChildren.filter((child, index) => { // filter children that correspont to the current insertionpoint.
                if (
                    !child.insertionPosition.placement.pathPointer
                    && child.insertionPosition.placement.type
                ) {
                    switch (child.insertionPosition.placement.type) {
                        case 'before':
                            firstChildren.push(child)
                            break;
                        case 'after':
                        default:
                            lastChildren.push(child)
                            break;
                    }
                    additionalFilteredChildren.splice(index, 1);
                }
                return result
            })
            ownFilteredChildren.map((ownChild, ownChildIndex) => {
                let lastKey = orderedChildren.push(ownChild) - 1
                additionalFilteredChildren.map((additionalChild, additionalChildIndex) => {
                    if (additionalChild.insertionPosition.placement.type
                        && additionalChild.insertionPosition.placement.pathPointer
                        && additionalChild.insertionPosition.placement.pathPointer == ownChild.insertionPosition.insertionPathPointer
                    ) {
                        switch (additionalChild.insertionPosition.placement.type) {
                            case 'before':
                                orderedChildren.splice(lastKey, 0, additionalChild)
                            break;
                            case 'after':
                            default:
                                orderedChildren.splice(lastKey + 1, 0, additionalChild)
                            break;
                        }
                    }
                })
            })

            return Array.prototype.concat(firstChildren, orderedChildren, lastChildren)
        }
        
        /**
         * Call correct execution type method of the current insertionpoint settings.
         */
        async initializeInsertionPoint({ insertionPoint, children }) {
            // [2] check type of subtrees execution: race first, all ... .
            let callback;
            switch(insertionPoint.executionType) { // execution type callback name
                case 'allPromise': 
                    callback = 'initializeNestedUnitInAllPromiseExecutionType'
                break;
                case 'raceFirstPromise': 
                    callback = 'initializeNestedUnitInRaceExecutionType'
                break;
                case 'middlewareArray': // TODO: Deprected name - Change middlewareArray in database to chronological
                case 'chronological': 
                    callback = 'initializeTreeInChronologicalSequence'
                break;
                default: 
                    console.log(`"${insertionPoint.executionType}" executionType doesn\'t match any kind.`)
            }
            // [3] call handler on them.
            return await this[callback](children)
        }

        async initializeTreeInChronologicalSequence(children /* nestedUnitChildren / TreeChildren */) {
            let array = [] // nested Unit Array or rendered nested unit initalization results.
            for (var index = 0; index < children.length; index++) {
                let child = children[index]
                // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                if(this.children.length != 0) {
                    await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                } else {
                    this.children = await this.additionalChildNestedUnit.slice()
                }
                let initialized = await this.initializeNestedUnit({
                    nestedUnitKey: child.nestedUnit,
                    additionalChildNestedUnit: this.children,
                    pathPointerKey: child.pathPointerKey
                })
                let subsequentArray = Array.isArray(initialized) ? initialized : [ initialized ]; // Convert to array                
                if(array.length != 0) {
                    await Array.prototype.push.apply(array, subsequentArray)
                } else {
                    array = await subsequentArray.slice()
                }
            }

            return array
        } 

        async initializeNestedUnitInRaceExecutionType(children) {
            let promiseArray = []
            promiseArray = children.map(conditionTreeChild => {
                return new Promise(async (resolve, reject) => {
                    // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                    
                    if(this.children.length != 0) {
                        await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                    } else {
                        this.children = await this.additionalChildNestedUnit.slice()
                    }

                    let callback = await this.initializeNestedUnit({
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
            }).catch(reason => { if(process.env.SZN_DEBUG == 'true' && this.portAppInstance.context.headers.debug == 'true') console.log(`🔀⚠️ promiseProperRace rejected because: ${reason}`) })
            return callback ? callback : false;
        }

        async initializeNestedUnitInAllPromiseExecutionType(children) {
            let promiseArray = []
            promiseArray = children.map(conditionTreeChild => {
                return new Promise(async (resolve, reject) => {
                    // Add the rest of the immediate children to the next tree as additional children. propagate children to the next tree.
                    
                    if(this.children.length != 0) {
                        await Array.prototype.push.apply(this.children, this.additionalChildNestedUnit)
                    } else {
                        this.children = await this.additionalChildNestedUnit.slice()
                    }

                    await this.initializeNestedUnit({
                        nestedUnitKey: conditionTreeChild.nestedUnit, 
                        additionalChildNestedUnit: this.children,
                        pathPointerKey: conditionTreeChild.pathPointerKey
                    })
                    resolve()
                })
            })

            await Promise.all(promiseArray).then(() => {
            }).catch(reason => { 
                if(process.env.SZN_DEBUG == 'true') console.log(`🔀⚠️ promiseProperRace rejected because: ${reason}`) 
                process.exit(1)
            })
            return;
        }

        
    }
    
    return self
}
