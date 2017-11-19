import assert from 'assert'
import ModuleClassContext from './entrypoint.js'

describe('Module Cacher', () => {
  describe('Caching module in different instances', () => {

    const func = function (superclass) {
        return class extends superclass {}
    }
    const superclass = class {}

    let { cacheObject: context, proxified: proxiedFunc } = new ModuleClassContext(func, '1')
    
    let moduleInstance1 = proxiedFunc(superclass)
    let moduleInstance2 = proxiedFunc(superclass)
    let moduleInstance3 = proxiedFunc(superclass)

    it('should be a function (class)', () => {
        assert.equal(typeof moduleInstance1, 'function')
    })
    
    it('should return cached instance on second call', () => {
        assert.strictEqual(moduleInstance1, moduleInstance2)
    })
    
    it('should create a single instance and cache it inside list object', () => {
        assert.strictEqual(Object.keys(context.list).length, 1)
    })
    
  })
})


