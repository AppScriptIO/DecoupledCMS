import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
const EventEmitter = require('events')
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

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
    let self = class NestedUnitController extends mix(superclass).with(...mixinArray) {
        static meta = {
            description: 'Static Reusable Controller'
        }

        static eventEmitter = new EventEmitter() // i.e. new EventEmitter()
        static extendedSubclass = {
            static: []
        }

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

        static initializeStaticClass() {
            if(methodInstanceName) {
                superclass.eventEmitter.on('initializationEnd', () => {
                    let ClassObject = {}
                    ClassObject[`${methodInstanceName}`] = self
                    superclass.addStaticSubclassToClassArray(ClassObject)
                })
            }
        }

        async getNestedUnit({ nestedUnitKey, controllerInstance = this, additionalChildNestedUnit = [], pathPointerKey = null}) {
            let nestedUnitInstance;
            if(!(nestedUnitKey in this.instance.nestedUnit)) {
                nestedUnitInstance = await new self.extendedSubclass.static['NestedUnit'](nestedUnitKey)
                nestedUnitInstance.__proto__.__proto__.__proto__ = Object.create(controllerInstance)
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

        async getUnitImplementation({unitKey, controllerInstance = this}) {
            let unitInstance;
            if(!(unitKey in this.instance.unit)) {
                unitInstance = await new self.extendedSubclass.static['UnitImplementation'](unitKey)
                unitInstance.__proto__.__proto__.__proto__ = Object.create(controllerInstance)
                // console.log(unitInstance)
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
    //         console.log(methodInstanceName)
    //         console.log(target)
    //       return true;
    //     }
    // })
    self = prototypeChainDebug(self)
    
    // add controller methods for the specific module that uses them.
    return mixin ?  
        mixin({ superclass: self}) :  // return Specific implementation Controller
        self; // return Reusable nested unit
}

