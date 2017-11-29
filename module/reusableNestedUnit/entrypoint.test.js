import assert from 'assert'
import createStaticInstanceClasses from './entrypoint.js'
import { default as Application } from 'appscript'

describe('ReusableNestedUnit module - Connecting class inhiritance dynamically', () => {

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

    describe.skip('Check instance prototype chain', () => {
        
        let Controller = createStaticInstanceClasses({
            superclass: Application, 
            implementationType: 'Middleware',
            cacheName: false
        })
        let portAppInstance = {
            context: { request:
                { method: 'GET',
                  url: '/asset/metadata/icon/favicon.ico',
                  header:
                   { host: 'cdn.localhost',
                     connection: 'keep-alive',
                     pragma: 'no-cache',
                     'cache-control': 'no-cache',
                     'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3276.0 Safari/537.36',
                     accept: 'image/webp,image/apng,image/*,*/*;q=0.8',
                     referer: 'http://localhost/',
                     'accept-encoding': 'gzip, deflate, br',
                     'accept-language': 'en-US,en;q=0.9' } },
               response:
                { status: 404,
                  message: 'Not Found',
                  header: { connection: 'keep-alive' } },
               app: { subdomainOffset: 1, proxy: false, env: 'development' },
               originalUrl: '/asset/metadata/icon/favicon.ico',
               req: '<original node req>',
               res: '<original node res>',
               socket: '<original node socket>' }
             
        }
        let instance = new Controller.extendedSubclass.static['NestedUnit']('43d6e114-54b4-47d8-aa68-a2ae97b961d5', portAppInstance)
        let controller = new Controller(false, { portAppInstance })
        let middlewareArray = controller.initializeNestedUnit({ nestedUnitKey: '43d6e114-54b4-47d8-aa68-a2ae97b961d5' })
        
        it(' ', () => {
            assert.strictEqual(instance.initializeNestedUnit, controller.initializeNestedUnit)
            // middlewareArray.then(x => {console.log(x)}).then(done)
        })
    
    })

    
})

setTimeout(() => {
    
}, 1000000);