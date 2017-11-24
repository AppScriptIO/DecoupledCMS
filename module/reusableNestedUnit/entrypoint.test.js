import assert from 'assert'
import createStaticInstanceClasses from './entrypoint.js'

describe('Connecting class inhiritance dynamically', () => {

    describe('Creating static classes without cache', () => {
        
        let Controller1 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: false
        })
        let Controller2 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: false
        })

        it('Should return different class references', () => {
            assert.notStrictEqual(Controller1, Controller2)
        })
    
    })
    
    describe('Caching static classes using automatic naming', () => {

        let Controller1 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: true
        })
        let Controller2 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: true
        })

        it('Should return different class references', () => {
            assert.notStrictEqual(Controller1, Controller2)
        })
    
    })
        
    describe('Caching static classes using different passed cacheName', () => {
        
        let Controller1 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: 'X'
        })
        let Controller2 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: 'Y'
        })

        it('Should return different class references', () => {
            assert.notStrictEqual(Controller1, Controller2)
        })
    
    })

    describe('Caching static classes using different same passed cacheName', () => {
        
        let Controller1 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: 'X'
        })
        let Controller2 = createStaticInstanceClasses({ 
            superclass: null, 
            implementationType: 'Middleware',
            cacheName: 'X'
        })

        it('Should return same class references', () => {
            assert.strictEqual(Controller1, Controller2)
        })

        it('Should return same subclass references', () => {
            assert.strictEqual(Controller1.extendedSubclass.static['NestedUnit'], Controller1.extendedSubclass.static['NestedUnit'])
            assert.strictEqual(Controller1.extendedSubclass.static['Unit'], Controller1.extendedSubclass.static['Unit'])
        })

    })

})