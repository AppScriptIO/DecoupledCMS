import { Mixin } from 'mixwith'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(superclass => {
    const Class = class extends superclass {
        
        async initializeNestedUnit(nestedUnitKey) { // Entrypoint Instance
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit(nestedUnitKey)

            // [2] get unit.
            let unitInstance = await this.getUnitImplementation(nestedUnitInstance.middlewareImplementation)
            return unitInstance

            let result = unitInstance.checkCondition()
            // [3] Iterate over insertion points
            let callback = false;
            if(result) {
                // get callback from subtrees
                for (let insertionPoint of nestedUnitInstance.insertionPoint) {
                    callback = await nestedUnitInstance.initializeInsertionPoint(insertionPoint)
                    if(callback) break
                }
                // if all subtress rejected, get immediate callback
                if(!callback && 'callback' in  nestedUnitInstance) {
                    callback = nestedUnitInstance.callback // fallback to immediate callback of instance.        
                }
            }
            // [4] Callback
            return callback
        }

        async initializeCondition(unitKey) {
            // self.debug.push(unitInstance)
            // [1] Instance.
            let UnitImplementation = self.extendedSubclass.static['UnitImplementation']
            let unitInstance = await UnitImplementation.createInstance(this.instance.unit, unitKey, UnitImplementation.getDocumentQuery)
            // [2] Check condition
            return await unitInstance.checkCondition()
        }


    }
    return Class
})