import { Mixin } from 'mixwith'
import createInstance from '../method/createInstance.staticMethod.js'

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
    Class.createInstance = createInstance
    return Class
})