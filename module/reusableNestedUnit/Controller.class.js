import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
const EventEmitter = require('events')
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'
import { MultiplePrototypeChain } from 'appscript/module/multiplePrototypeChain'
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

            // create a new list object for proxied refrence of subclasses
            contextInstance.instanceExtendedSubclass = Object.keys(self.extendedSubclass.static)
                .reduce((object, key) => {
                    // add proxied subclass to the list
                    object[key] = MultiplePrototypeChain.newChainOnInstanceCreation({
                        Class: self.extendedSubclass.static[key],
                        contextInstance
                    })
                    return object
                }, {})
            return contextInstance
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

        async getNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) {
            let nestedUnitInstance;
            if(!(nestedUnitKey in this.instance.nestedUnit)) {
                nestedUnitInstance = await this.callSubclass('NestedUnit', [nestedUnitKey])
                await nestedUnitInstance.initializeInstance()
                // add children trees: 
                nestedUnitInstance.additionalChildNestedUnit = additionalChildNestedUnit
                // add pathPointerKey to allow applying additional corresponding additional children.
                nestedUnitInstance.pathPointerKey = pathPointerKey
                // add to class cache
                this.instance.nestedUnit[nestedUnitKey] = nestedUnitInstance
            } else {
                nestedUnitInstance = this.instance.nestedUnit[nestedUnitKey]
            }
            return nestedUnitInstance
        }

        async getUnit({unitKey}) {
            let unitInstance;
            if(!(unitKey in this.instance.unit)) {
                unitInstance = await this.callSubclass('Unit', [unitKey])
                await unitInstance.initializeInstance()
                this.instance.unit[unitKey] = unitInstance
            } else {
                unitInstance = this.instance.unit[unitKey]
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

