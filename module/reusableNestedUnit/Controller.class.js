import commonMethod from './commonMethod.mixin'
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { superclassInstanceContextPattern } from 'appscript/utilityFunction/superclassInstanceContextPattern.js'
import { mix } from 'mixwith'

function cacheInstance({ cacheArrayName, keyArgumentName = 'key' }) { // decorator + proxy
    return (target, name, descriptor) => {
        let method = target[name]
        descriptor.value = new Proxy(method, {
            apply: async (target, thisArg, argumentsList) => {
                let [{ [keyArgumentName]: key }] = argumentsList // extract key using the specified key parameter name in the method.
                let cacheArray = thisArg.instance[cacheArrayName] // Sub array of 'this.instance' in which instances are saved.
                let instance;
                if(key in cacheArray) {
                    instance = cacheArray[key]
                } else {
                    instance = await target.apply(thisArg, argumentsList)
                    cacheArray[key] = instance // add to class cache
                }
                return instance
            }          
        })
        return descriptor
    }
}

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
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @add({ to: 'static'}, { 
            createInstance,
            populateInstancePropertyFromJson,
            addStaticSubclassToClassArray
        })
        @add({ to: 'prototype'}, {
            populateInstancePropertyFromJson_this
        })
        @conditional({ condition: mixin, decorator: applyMixin({ mixin }) })
        @extendedSubclassPattern.Superclass()
        @superclassInstanceContextPattern()
        @conditional({ decorator: extendedSubclassPattern.Subclass(), condition: (methodInstanceName && Superclass) })
        class ReusableController extends mix(Superclass).with(...mixinArray) {

            @cacheInstance({ 
                cacheArrayName: 'nestedUnit',
                keyArgumentName: 'nestedUnitKey'
            })
            async getNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) {
                let instance = await this.callSubclass('NestedUnit', [nestedUnitKey])
                await instance.initializeInstance()
                // add children trees: 
                instance.additionalChildNestedUnit = additionalChildNestedUnit
                // add pathPointerKey to allow applying additional corresponding additional children.
                instance.pathPointerKey = pathPointerKey
                return instance
            }

            @cacheInstance({ 
                cacheArrayName: 'unit',
                keyArgumentName: 'unitKey'
            })
            async getUnit({ unitKey }) {
                let instance = await this.callSubclass('Unit', [unitKey])
                await instance.initializeInstance()
                return instance
            }

        }

    return self
}

