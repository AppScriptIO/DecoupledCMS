import assert from 'assert'
import { ClassProducer } from './dynamicClassExtention.js'
// const ModuleContext = require('appscript/module/ModuleContext')

describe('Testing different implementation concepts', () => {
    
    describe('Creating static classes from function', () => {
        let staticClass1 = ClassProducer({ Superclass: null /* semilar to extending Function.prototype (if it was possible as it is an object) */ })
        let staticClass2 = ClassProducer({ Superclass: Object /* Object function */ })
        let staticClass3 = ClassProducer({ Superclass: Function /* Object prototype */ })
        
        it('should create a class that extends from Function.prototype, Object.prototype, & null', () => {
            assert.strictEqual(staticClass1.__proto__, Function.prototype)
            assert.strictEqual(staticClass1.__proto__.__proto__, Object.prototype)
            assert.strictEqual(staticClass1.__proto__.__proto__.__proto__, null)
        })
        it('should create a class that extends from Object function, Function.prototype, Object.prototype, & null', () => {
            assert.strictEqual(staticClass2.__proto__, Object)
            assert.strictEqual(staticClass2.__proto__.__proto__, Function.prototype)
            assert.strictEqual(staticClass2.__proto__.__proto__.__proto__, Object.prototype)
            assert.strictEqual(staticClass2.__proto__.__proto__.__proto__.__proto__, null)
        })
        it('should create a class that extends from Function, Function.prototype, Object.prototype, & null', () => {
            assert.strictEqual(staticClass3.__proto__, Function)
            assert.strictEqual(staticClass3.__proto__.__proto__, Function.prototype)
            assert.strictEqual(staticClass3.__proto__.__proto__.__proto__, Object.prototype)
            assert.strictEqual(staticClass3.__proto__.__proto__.__proto__.__proto__, null)
        })
    })

    describe('', () => { 
        
    })
        
})

setTimeout(() => {
    
}, 10000000000);