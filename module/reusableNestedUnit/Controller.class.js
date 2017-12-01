import { mix } from 'mixwith'
import commonMethod from './commonMethod.mixin'
const EventEmitter = require('events')
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { MultiplePrototypeChain } from 'appscript/module/multiplePrototypeChain'
import { add, execute } from 'appscript/utilityFunction/decoratorUtility.js'

/**
 * @class
 * @usage new instance is created for each check.
 */
export default ({
    methodInstanceName,
    Superclass,
    mixin
}) => {
    let mixinArray = [/*commonMethod*/]
    let self = 
        @prototypeChainDebug
        @add({ to: 'static'}, { 
            createInstance,
            populateInstancePropertyFromJson,
            addStaticSubclassToClassArray
        })
        @add({ to: 'prototype'}, {
            populateInstancePropertyFromJson_this
        })
        @execute({ staticMethod: 'initializeStaticClass' })
        class ReusableController extends mix(Superclass).with(...mixinArray) {

            static eventEmitter = new EventEmitter() // i.e. new EventEmitter()
            static extendedSubclass = {
                static: {}
            }

            static initializeStaticClass() {
                // Mutation observer on array for debugging purposes.
                // self.extendedSubclass.static = new Proxy(self.extendedSubclass.static, {
                //     set: function(target, property, value, receiver) {      
                //         target[property] = value;
                //         console.log(self.extendedSubclass.static)
                //       return true;
                //     }
                // })
        
                if(methodInstanceName && Superclass && Superclass.eventEmitter) {
                    super.eventEmitter.on('initializationEnd', () => {
                        let ClassObject = {}
                        ClassObject[`${methodInstanceName}`] = self
                        super.addStaticSubclassToClassArray(ClassObject)
                    })
                }
            }

            static initializeStaticClassControllerLevel() {
                let Class = this
                Class.eventEmitter.on('initializationEnd', () => {
                    let ClassObject = {}
                    ClassObject[`${Class.name}`] = Class
                    Class.addStaticSubclassToClassArray(ClassObject)
                })
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

            static callSubclass(name, args) {
                return Reflect.construct(self.extendedSubclass.static[name], args)
            }

            /**
             * Properties on instnace object (not on the prototype)
             */
            AppInstance; // calling instance that contains the context
            instance = {
                nestedUnit: [],
                unit: [],
            } 
            // conditionTreeKey -> { Json data, properties } 

            constructor(skipConstructor = false, {portAppInstance}) {
                super(true)
                if(skipConstructor) return;
                if(portAppInstance) this.AppInstance = portAppInstance
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

    // add controller methods for the specific module that uses them.
    let Controller
    if(mixin) {
        Controller = mixin({ Superclass: self}) // return Specific implementation Controller
    } else {
        Controller = self; // return Reusable nested unit
    }
    return Controller
}

