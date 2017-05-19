import { Mixin } from 'mixwith'
import createInstance from 'appscript/module/createInstance.staticMethod'
import { usingGenericInstance as populateInstancePropertyFromJson, usingThis as populateInstancePropertyFromJson_this } from 'appscript/module/populateInstancePropertyFromJson.method'
import addStaticSubclassToClassArray from 'appscript/module/addStaticSubclassToClassArray.staticMethod'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(superclass => {
    const Class = class extends superclass {
        constructor(...args) {
            // mixins should either 1) not define a constructor, 2) require a specific
            // constructor signature, or 3) pass along all arguments.
            super(...args);
        }
        // async populateTreeInstanceProperty(conditionTreeJsonData) { // applies json to instance & adds instance 'jsonData' to mark it as instantiated.
        //     this.populateInstancePropertyFromJson(conditionTreeJsonData)
        //     this.jsonData = conditionTreeJsonData
        // }
    }
    Class.addStaticSubclassToClassArray = addStaticSubclassToClassArray
    Class.createInstance = createInstance
    Class.populateInstancePropertyFromJson = populateInstancePropertyFromJson
    Class.prototype.populateInstancePropertyFromJson_this = populateInstancePropertyFromJson_this
    return Class
})