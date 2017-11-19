class ModuleClassContext {
    constructor(target, cacheName) {
      this.counter = 0
      this.list = []
      this.cacheName = cacheName
      return {
          proxified: this.proxify(target),
          cacheObject: this
      }
    }
    
    proxify(target) {
      let cache = this
      let handler = {
        apply: (target, thisArg, argumentsList) => {
            let instance
            cache.counter ++
            if(cache.cacheName && typeof cache.list[cache.cacheName] !== 'undefined') {
                instance = cache.list[cache.cacheName]
            } else if(cache.cacheName) {
                if(typeof argumentsList[0] == 'object' ) {
                    cache.list[cache.cacheName] = target.call(thisArg, Object.assign({ methodInstanceName: cache.cacheName }, argumentsList[0]))
                } else {
                    cache.list[cache.cacheName] = target.call(thisArg, ...argumentsList)
                }
                instance = cache.list[cache.cacheName]
            } else {
                instance = target.call(thisArg, argumentsList)
            }
            return instance
        }
      }
      return new Proxy(target, handler)
    }
}

  export default ModuleClassContext