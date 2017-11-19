import assert from 'assert'
import ModuleClassContext from './entrypoint.js'

const func = function (superclass) {
    return class extends superclass {}
}
const superclass = class {}    

describe('Module Cacher', () => {
    beforeEach(() => {
    })

  describe('Caching module in different instances', () => {

    let proxiedFunc  = new ModuleClassContext({ target: func, cacheName: '1'})
    
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
        assert.strictEqual(Object.keys(proxiedFunc.moduleContext.list).length, 1)
    })
    
  })

  describe('Using module without caching reference', () => {   
    let proxiedFunc  = new ModuleClassContext({ target: func })
    
    let moduleInstance1 = proxiedFunc(superclass)
    let moduleInstance2 = proxiedFunc(superclass)
    let moduleInstance3 = proxiedFunc(superclass)

    it('should create different instances', () => {
        assert.notStrictEqual(moduleInstance1, moduleInstance2)
        assert.notStrictEqual(moduleInstance1, moduleInstance3)
    })
  })
})


