import { Mixin } from 'mixwith'

let mixin = Mixin(superclass => {
    const self = class extends superclass {

        constructor(...args) {
            // mixins should either 1) not define a constructor, 2) require a specific
            // constructor signature, or 3) pass along all arguments.
            super(...args);
        }

        // async populateTreeInstanceProperty(conditionTreeJsonData) { // applies json to instance & adds instance 'jsonData' to mark it as instantiated.
        //     this.populateInstancePropertyFromJson(conditionTreeJsonData)
        //     this.jsonData = conditionTreeJsonData
        // }

        async populateInstancePropertyFromJson(jsonData) { // creates properties for instance corresponding to the json objects' key-value pairs.
            if(jsonData) {
                Object.entries(jsonData).forEach(
                    ([key, value]) => this[key] = value
                )
            }
            this.jsonData = jsonData // to keep track of populated instances.
        }

        static async createInstance(controllerInstanceArray, dataKey, getDocumentQueryCallback) { // create unit instance, query data, and populate json data to instance.
            let self = this
            // [1] Create new instance 
            let instance;
            if(!(dataKey in controllerInstanceArray)) {
                instance = await new self(dataKey)
                controllerInstanceArray[dataKey] = instance
            } else {
                instance = controllerInstanceArray[dataKey] // Preserved between requests. Causes problems
            }
            // // [2] Populate properties.
            if(!('jsonData' in instance)) { // if not already populated with data.
                let jsonData = await getDocumentQueryCallback(self.rethinkdbConnection, dataKey)
                await instance.populateInstancePropertyFromJson(jsonData)
            }
            return instance // return the newly cr
        }

    }
    return self
})

export default mixin