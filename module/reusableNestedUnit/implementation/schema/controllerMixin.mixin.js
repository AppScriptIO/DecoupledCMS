import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import assert from "assert"

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class MiddlewareMixin extends Superclass {

        /**
         * 
         * @return {Array of Objects}  each object contains instruction settings to be used through an implementing module.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null, parentResult }) { // Entrypoint Instance
            assert(nestedUnitKey, '• Key should be present. The passed value is either undefined, null, or empty string.')
            
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            let { unitKey: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnit({ unitKey })
            await unitInstance.pupolateUnitWithFile()
            
            this.ownResultData = await unitInstance.resolveDataset({parentResult})
            let subsequentDataset = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoContentObject' })

            let responseObject = {
                dataset: this.ownResultData,
                subsequentDataset: subsequentDataset
            }
            
            return responseObject
        }
    }
    
    return self
})