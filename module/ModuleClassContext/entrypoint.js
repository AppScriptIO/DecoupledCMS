/**
 * Caches modules on demand using a unique key name. 
 * Usage options: 
 *  • With key - Once during app initialization, where references are saved (hard link) - e.g. condition, middleware.
 *  • Anonymous - Several times during app runtime, where instances should be garbage collected - e.g. template.
 */

class ModuleClassContext {
    constructor({ target, cacheName = null }) {
        /* this = cache module context */
        this.counter = 0
        this.list = {}
        this.cacheName = cacheName
        let proxified = this.proxify(target)
        return proxified
    }
    
    proxify(target) {
      let cacheContext = this
      let handler = {

        get: (target, property, receiver) => {
            if(property == 'moduleContext') return cacheContext;
        },

        apply: (target, thisArg, argumentsList) => {
            let instance
            cacheContext.counter ++
            if(cacheContext.cacheName && cacheContext.list[cacheContext.cacheName]) {
                instance = cacheContext.list[cacheContext.cacheName]
            } else if(cacheContext.cacheName) {
                if(typeof argumentsList[0] == 'object' ) {
                    cacheContext.list[cacheContext.cacheName] = target.call(thisArg, Object.assign({ methodInstanceName: cacheContext.cacheName }, argumentsList[0]))
                } else {
                    cacheContext.list[cacheContext.cacheName] = target.call(thisArg, ...argumentsList)
                }
                instance = cacheContext.list[cacheContext.cacheName]
            } else {
                instance = target.call(thisArg, ...argumentsList)
            }
            return instance
        }

      }
      return new Proxy(target, handler)
    }
}

export default ModuleClassContext