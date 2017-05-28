import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
const ModuleClassContext = require('appscript/module/ModuleClassContext')
const EventEmitter = require('events')
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'

/**
 * @class
 * @usage new instance is created for each check.
 */
module.exports = new ModuleClassContext((methodInstanceName, superclass, controllerMixin) => {
    let mixinArray = [commonMethod]
    const self = class NestedUnitController extends mix(superclass).with(...mixinArray) {

        static eventEmitter = new EventEmitter() // i.e. new EventEmitter()
        static extendedSubclass = {
            static: []
        }

        AppInstance; // calling instance that contains the context
        instance = {
            nestedUnit: [],
            unit: [],
        } // conditionTreeKey -> { Json data, properties } 

        constructor(skipConstructor = false, portAppInstance) {
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

        async getNestedUnit({nestedUnitKey, controllerInstance = this}) {
            let nestedUnitInstance;
            if(!(nestedUnitKey in this.instance.nestedUnit)) {
                nestedUnitInstance = await new self.extendedSubclass.static['NestedUnit'](nestedUnitKey)
                nestedUnitInstance.__proto__.__proto__.__proto__ = Object.create(controllerInstance)
                await nestedUnitInstance.initializeInstance()
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
     // add controller methods for the specific module that uses them.
    return controllerMixin ?  controllerMixin(self) : self;
})

