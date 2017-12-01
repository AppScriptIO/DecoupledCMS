import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class ConditionMixin extends Superclass {

        /**
         * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
         * 
         * @param {any} {nestedUnitKey} 
         * @returns { Object || False } Object containing instruction settings to be used through an implementing module.
         */
        async initializeConditionTree({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) { // Entrypoint Instance
            // self.debug.push(nestedUnitKey)
            // let nestedUnitInstance = await ConditionTree.createInstance(this.instance.nestedUnit, nestedUnitKey, ConditionTree.getDocumentQuery)
            
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            
            // [2] Check condition.
            let {conditionImplementation:unitKey} = nestedUnitInstance
            let unitInstance = await this.getUnit({unitKey})
            
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
    
    return self
})