import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'

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
         * Get children corresponding to the current insertion point.
         */
        async filterChildrenOfCurrentInsertionPoint({
            insertionPointKey,
            children = this.children
         } = {}) {
            // [1] get children immediate & relating to this insertion position.
            return await children.filter(child => { // filter children that correspont to the current insertionpoint.
                return (
                    child.insertionPosition.insertionPoint == insertionPointKey &&
                    child.insertionPosition.insertionPathPointer == null
                )
            })
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
        async filterChildren({insertionPointKey}) {
            let ownFilteredChildren = await this.filterAndModifyChildrenArray(this.children, insertionPointKey, null)
            let additionalFilteredChildren = await this.filterAndModifyChildrenArray(this.additionalChildNestedUnit, insertionPointKey, this.pathPointerKey)
            return await this.mergeAndOrderChildren(ownFilteredChildren, additionalFilteredChildren);
        }

        async filterAndModifyChildrenArray(childrenArray, insertionPointKey, pathPointerKey) {
            return childrenArray.filter((child, index) => { // filter children that correspont to the current insertionpoint.
                let result = (child.insertionPosition.insertionPoint == insertionPointKey && child.insertionPosition.insertionPathPointer == pathPointerKey)
                // if (result) childrenArray.splice(index, 1); // was ment to increase the performance of the program, preventing rechecking of already checked array items. But it causes some issues.
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
        
    }
    
    return self
}
