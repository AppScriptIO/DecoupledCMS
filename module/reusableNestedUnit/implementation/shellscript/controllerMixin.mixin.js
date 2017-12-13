import { Mixin } from 'mixwith'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
    class ShellscriptMixin extends Superclass {

        /**
         * @description when first called "this" context is assigned to the AppInstance for the comming request. And on subsequest calls it is assigned to the nestedUnit instance.
         * 
         * @param {any} {nestedUnitKey} 
         * @returns { Object || False } Object containing instruction settings to be used through an implementing module.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) { // Entrypoint Instance           
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            
            if(nestedUnitInstance.unit) {
                let { unit: unitKey} = nestedUnitInstance
                let unitInstance = await this.getUnit({ unitKey })
                // execute command
                try {
                    await unitInstance.executeScript()
                } catch (error) { // NOT WORKING !!! 
                    console.log('ERRORED !!!')
                    throw error
                }
            }
            
            // [3] Iterate over insertion points
            await nestedUnitInstance.loopInsertionPoint({ type: 'executeScript' })
        }        
    }
    
    return self
})