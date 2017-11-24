import { Mixin } from 'mixwith'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ superclass }) => {
    let self = class ConditionMixin extends superclass {

        /**
         * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
         * 
         * @param {any} {nestedUnitKey, controllerInstance = this} 
         * @returns 
         */
        async initializeConditionTree({ nestedUnitKey, controllerInstance = this, additionalChildNestedUnit = [], pathPointerKey = null}) { // Entrypoint Instance
            // self.debug.push(nestedUnitKey)
            // let nestedUnitInstance = await ConditionTree.createInstance(this.instance.nestedUnit, nestedUnitKey, ConditionTree.getDocumentQuery)
            
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, controllerInstance, additionalChildNestedUnit, pathPointerKey })
            // [2] Check condition.
            let {conditionImplementation:unitKey} = nestedUnitInstance
            let unitInstance = await this.getUnitImplementation({unitKey, controllerInstance})
            
            let conditionMet = await unitInstance.checkCondition()
            
            // [3] Iterate over insertion points
            let callback;
            if (conditionMet) {
                callback = await nestedUnitInstance.loopInsertionPoint()
                // if all subtrees rejected, get immediate callback
                if(!callback && 'callback' in  nestedUnitInstance) callback = nestedUnitInstance.callback // fallback to immediate callback of instance.
            }

            // [4] Callback
            return (callback) ? callback : false;
        }        
    }
    self = prototypeChainDebug(self)
    
    return self
})