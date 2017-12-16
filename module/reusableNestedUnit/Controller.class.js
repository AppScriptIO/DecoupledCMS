const EventEmitter = require('events');
import commonMethod from './commonMethod.mixin'
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'
import { superclassInstanceContextPattern, cacheInstance } from 'appscript/utilityFunction/superclassInstanceContextPattern.js'
import { mix } from 'mixwith'
import assert from 'assert'

/**
 * @class
 * @usage new instance is created for each check.
 */
export default ({
    methodInstanceName,
    Superclass = EventEmitter, // defaulting to EventEmitter and not Object / Function because extending Object/Function manipulates this prototype in new calls for some reason.
    mixin, 
    rethinkdbConnection = Superclass.rethinkdbConnection
} = {}) => {
    Superclass.rethinkdbConnection = rethinkdbConnection // Setting this variable on Controller class below causes issues, which maybe related to the way rethinkdb is called or the proxies encapsulating the class.
    let mixinArray = [/*commonMethod*/]
    let self = 
        @add({ to: 'static'}, { 
            createInstance,
            populateInstancePropertyFromJson,
            addStaticSubclassToClassArray,
        })
        @add({ to: 'prototype'}, {
            populateInstancePropertyFromJson_this
        })
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @extendedSubclassPattern.Superclass()
        @conditional({ decorator: extendedSubclassPattern.Subclass(), condition: (methodInstanceName && Superclass && Superclass.addSubclass != undefined ) })
        @conditional({ condition: mixin, decorator: applyMixin({ mixin }) })
        @superclassInstanceContextPattern() // applied on the mixin i.e. specific controller.
        class ReusableController extends mix(Superclass).with(...mixinArray) {

            @cacheInstance({ 
                cacheArrayName: 'nestedUnit',
                keyArgumentName: 'nestedUnitKey'
            })
            async getNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null}) {
                let instance = await this.callSubclass('NestedUnit', [nestedUnitKey])
                if(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name == 'Object') {
                    console.log('Opsie !!')
                }
                await instance.reflectDatabaseDataToAppObject()
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
                await instance.reflectDatabaseDataToAppObject()
                return instance
            }
            
            /**
             * @description gets document from database using documentKey and populates the data to the instance.
             * during which 'jsonData' property is set. if it is set, it means that the instance is already populated with data.
             * 
             */
            async reflectDatabaseDataToAppObject({
                object = this, 
                key = this.key, 
                queryFunc = this.constructor.getDocumentQuery,
                connection = self.rethinkdbConnection
            } = {}) {
                assert.strictEqual(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name, 'TcpConnection')
                if(!('jsonData' in object)) { // if not already populated with data.
                    let jsonData = await queryFunc({ key, connection })
                    await this.populateInstancePropertyFromJson_this({ jsonData })
                }
            }

        }

    return self
}

