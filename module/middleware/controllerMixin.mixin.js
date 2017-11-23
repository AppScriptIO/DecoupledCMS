import { Mixin } from 'mixwith'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(superclass => {
    let self = class MiddlewareMixin extends superclass {

        async initializeNestedUnit({ nestedUnitKey, controllerInstance = this, additionalChildNestedUnit = [], pathPointerKey = null }) { // Entrypoint Instance
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, controllerInstance, additionalChildNestedUnit, pathPointerKey })
            // [2] get unit.
            let { middlewareImplementation: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnitImplementation({ unitKey, controllerInstance })
            await unitInstance.pupolateMiddlewareFile()

            let middlewareArray = []
            middlewareArray.push(unitInstance)

            // [3] Iterate over insertion points
            let subsequentMiddleware = await nestedUnitInstance.loopInsertionPoint()
             
            if(middlewareArray.length != 0) {
                await Array.prototype.push.apply(middlewareArray, subsequentMiddleware)
            } else {
                middlewareArray = await subsequentMiddleware.slice()
            }
            return middlewareArray
        }
    }
    self = prototypeChainDebug(self)
    
    return self
})