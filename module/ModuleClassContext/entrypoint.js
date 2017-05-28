/**
 * @class
 * @description class used to store module instances as a way to cache them by reference key name in the array. Giving essentially a context for each saved module instance.
 **/
const self = class ModuleClassContext {

    methodInstance = [];

    constructor(createModuleInstance) {
        const self = this

        /**
         * @param {string} methodInstanceName the key name used to save the created instance or null for creating without saving.
         * @param {multipleArguments} ... spread operator, unique parameters different depending on the function passed.
         * @returns {instance} class instance of the module being required.
         */
        self.createModuleInstance = createModuleInstance
    }

    /**
     * 
     * 
     * @param {string} [methodInstanceName=null] key name of saved or being saved instance.
     * @param {array} [args=[]] parameters to be called for createModuleInstance i.e. the function passed for creating ModuleClassContext class instance.
     * @param {boolean} [importerName=null] debug on/off.
     * @returns instance of a module, either created newly or returned from cache.
     */
    getMethodInstance(methodInstanceName = null, args = [], importerName = null) {
        const self = this
        let debug = (importerName) ? true : false;
        if(debug) console.log(importerName) // Debug purposes to check which file impoerted it.
        if(methodInstanceName && typeof self.methodInstance[methodInstanceName] !== 'undefined')  {
            if(debug) console.log('already defined !')
            return self.methodInstance[methodInstanceName]
        } else if(methodInstanceName) {
            if(debug) console.log('create new instance !')
            self.methodInstance[methodInstanceName] = self.createModuleInstance(methodInstanceName, ...args) // add name to argument so ti cab be accessed by createModuleInstance.
            return self.methodInstance[methodInstanceName]
        } else {
            if(debug) console.log('create without saving !')
            return self.createModuleInstance(null, ...args)
        }
    }
    
}

module.exports = self
