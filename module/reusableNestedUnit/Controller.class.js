import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
const EventEmitter = require('events')
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'
import assert from 'assert'

let debugExecuted = false
let debugEx2 = false
/**
 * @class
 * @usage new instance is created for each check.
 */
module.exports = ({
    methodInstanceName,
    superclass,
    mixin
}) => {
    let mixinArray = [/*commonMethod*/]
    let self = class ReusableController extends mix(superclass).with(...mixinArray) {
        static meta = {
            description: 'Static Reusable Controller'
        }

        static eventEmitter = new EventEmitter() // i.e. new EventEmitter()
        static extendedSubclass = {
            static: {}
        }

        /**
         * Properties on instnace object (not on the prototype)
         */
        AppInstance; // calling instance that contains the context
        instance = {
            nestedUnit: [],
            unit: [],
        } // conditionTreeKey -> { Json data, properties } 

        constructor(skipConstructor = false, {portAppInstance}) {
            super(true)
            if(skipConstructor) return;
            if(portAppInstance) this.AppInstance = portAppInstance
        }

        static createContext(...args) {
            let self = this // specific Controller that is a subclass of 'self' (ReusableController)
            let contextInstance = new self(false, ...args)

            // create proxied refrence of subclasses
            contextInstance.instanceExtendedSubclass = Object.keys(self.extendedSubclass.static)
                .reduce((object, key) => {
                    // add proxy to the subclass
                    object[key] = self.createPrototypeChainOnConstructor(self.extendedSubclass.static[key]);
                    return object
                }, {})
            return contextInstance
        }

        static createPrototypeChainOnConstructor(Class) {
            return new Proxy(Class, {
                construct: (target, argumentsList, newConstructorFunc) => {
                    let instance = Reflect.construct(target, argumentsList)
                    Object.setPrototypeOf(instance, self.createUniqueProtoChain(Object.getPrototypeOf(instance)))
                    console.log(instance.__proto__.__proto__)
                    return instance
                },
                // getPrototypeOf(target) {

                // }                    
            })
        }

        static createUniqueProtoChain(currentPrototype) {
            if( currentPrototype == null || 
                currentPrototype.constructor == Object ||
                currentPrototype.constructor == Function
            ) return currentPrototype
            
            let delegatedPrototype = Object.getPrototypeOf(currentPrototype)
            let pointerPrototype = Object.create(self.createUniqueProtoChain(delegatedPrototype))
            pointerPrototype = new Proxy(pointerPrototype, {
                get: function(target, property, receiver) {
                    Object.defineProperty(pointerPrototype, 'delegatedPrototype', {
                        value: currentPrototype,
                        writable: true,
                        enumerable: true,
                        configurable: true
                    })
                    switch (property) {
                        case 'delegatedPrototype':
                            return currentPrototype
                        break;
                        case '__proto__':
                            return Object.getPrototypeOf(pointerPrototype)
                        break;
                        default:
                        break;
                    }
                    if(currentPrototype.hasOwnProperty(property)) {
                        return Reflect.get(currentPrototype, property)
                    } else if(Object.getPrototypeOf(target)) {
                        return Reflect.get(Object.getPrototypeOf(target), property)
                    } else {
                        return undefined
                    }
                }
            })            
            return pointerPrototype
        }

        static initializeStaticClass() {
            if(methodInstanceName && superclass && superclass.eventEmitter) {
                superclass.eventEmitter.on('initializationEnd', () => {
                    let ClassObject = {}
                    ClassObject[`${methodInstanceName}`] = self
                    superclass.addStaticSubclassToClassArray(ClassObject)
                })
            }
        }

        static callSubclass(name, args) {
            return Reflect.construct(self.extendedSubclass.static[name], args)
        }
        callSubclass(name, args) {
            let contextInstance = this
            return Reflect.construct(contextInstance.instanceExtendedSubclass[name], args)
        }

        async getNestedUnit({ nestedUnitKey, controllerInstance = this, additionalChildNestedUnit = [], pathPointerKey = null}) {
            let nestedUnitInstance;
            if(!(nestedUnitKey in controllerInstance.instance.nestedUnit)) {
                if(this.instanceExtendedSubclass) {
                    nestedUnitInstance = await this.callSubclass('NestedUnit', [nestedUnitKey])                    
                    if(!debugExecuted) {
                        controllerInstance = this.__proto__
                        // console.log(controllerInstance)
                        // console.log(nestedUnitInstance.__proto__.__proto__.__proto__)
                        controllerInstance.AppInstance = this.AppInstance
                        controllerInstance.instance = this.instance
                        assert.strictEqual(controllerInstance, nestedUnitInstance.__proto__.__proto__.__proto__)
                        debugExecuted = true
                    }
                    nestedUnitInstance.__proto__.__proto__.__proto__ = controllerInstance
                } else {
                    nestedUnitInstance = await self.callSubclass('NestedUnit', [nestedUnitKey])                    
                    if(!debugExecuted) {
                        controllerInstance = this.__proto__
                        // console.log(controllerInstance)
                        // console.log(nestedUnitInstance.__proto__.__proto__.__proto__)
                        controllerInstance.AppInstance = this.AppInstance
                        controllerInstance.instance = this.instance
                        assert.strictEqual(controllerInstance, nestedUnitInstance.__proto__.__proto__.__proto__)
                        debugExecuted = true
                    }
                    nestedUnitInstance.__proto__.__proto__.__proto__ = controllerInstance
                }
                await nestedUnitInstance.initializeInstance()
                // add children trees: 
                nestedUnitInstance.additionalChildNestedUnit = additionalChildNestedUnit
                // add pathPointerKey to allow applying additional corresponding additional children.
                nestedUnitInstance.pathPointerKey = pathPointerKey
                // add to class cache
                controllerInstance.instance.nestedUnit[nestedUnitKey] = nestedUnitInstance
            } else {
                nestedUnitInstance = controllerInstance.instance.nestedUnit[nestedUnitKey]
            }
            return nestedUnitInstance
        }

        async getUnit({unitKey, controllerInstance = this}) {
            let unitInstance;
            if(!(unitKey in controllerInstance.instance.unit)) {
                if(this.instanceExtendedSubclass) {
                    unitInstance = await this.callSubclass('Unit', [unitKey])
                    if(!debugEx2) {
                        controllerInstance = this.__proto__
                        // console.log(controllerInstance)
                        // console.log(nestedUnitInstance.__proto__.__proto__.__proto__)
                        controllerInstance.AppInstance = this.AppInstance
                        controllerInstance.instance = this.instance
                        assert.strictEqual(controllerInstance, unitInstance.__proto__.__proto__.__proto__)
                        debugEx2 = true
                    }
                    // assert.strictEqual(unitInstance.__proto__.__proto__.__proto__, controllerInstance)
                    unitInstance.__proto__.__proto__.__proto__ = controllerInstance
                } else {
                    unitInstance = await self.callSubclass('Unit', [unitKey])
                    if(!debugEx2) {
                        controllerInstance = this.__proto__
                        // console.log(controllerInstance)
                        // console.log(nestedUnitInstance.__proto__.__proto__.__proto__)
                        controllerInstance.AppInstance = this.AppInstance
                        controllerInstance.instance = this.instance
                        assert.strictEqual(controllerInstance, unitInstance.__proto__.__proto__.__proto__)
                        debugEx2 = true
                    }
                    // assert.strictEqual(unitInstance.__proto__.__proto__.__proto__, controllerInstance)
                    unitInstance.__proto__.__proto__.__proto__ = controllerInstance
                }
                // console.log(unitInstance)
                await unitInstance.initializeInstance()
                controllerInstance.instance.unit[unitKey] = unitInstance
            } else {
                unitInstance = controllerInstance.instance.unit[unitKey]
            }
            return unitInstance
        }

    }

    self.addStaticSubclassToClassArray = function(...args) {
        // this - is a subclass of the class which the method resides.
        addStaticSubclassToClassArray.call(this, ...args)
    }
    self.createInstance = createInstance
    self.populateInstancePropertyFromJson = populateInstancePropertyFromJson
    self.prototype.populateInstancePropertyFromJson_this = populateInstancePropertyFromJson_this

    self.initializeStaticClass()

    // Mutation observer on array for debugging purposes.
    // self.extendedSubclass.static = new Proxy(self.extendedSubclass.static, {
    //     set: function(target, property, value, receiver) {      
    //         target[property] = value;
    //         console.log(self.extendedSubclass.static)
    //       return true;
    //     }
    // })
    self = prototypeChainDebug(self)
    
    // add controller methods for the specific module that uses them.
    let Controller
    if(mixin) {  
        Controller = mixin({ superclass: self}) // return Specific implementation Controller
    } else {
        Controller = self; // return Reusable nested unit
    }
    return Controller
}

