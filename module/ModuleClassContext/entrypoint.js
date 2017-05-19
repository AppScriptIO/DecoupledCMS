/**
 * @class
 * @description class used to store module instances as a way to cache them by reference key name in the array. Giving essentially a context for each saved module instance.
 **/
const self = class ModuleClassContext {

    methodInstance = [];

    constructor(createModuleInstance) {
        const self = this
        self.createModuleInstance = createModuleInstance
    }

    getMethodInstance(methodInstanceName = null, argument, importerName = null) {
        const self = this
        let debug = (importerName) ? true : false;
        if(debug) console.log(importerName) // Debug purposes to check which file impoerted it.
        if(methodInstanceName && typeof self.methodInstance[methodInstanceName] !== 'undefined')  {
            if(debug) console.log('already defined !')
            return self.methodInstance[methodInstanceName]
        } else if(methodInstanceName) {
            if(debug) console.log('create new instance !')
            argument['methodInstanceName'] = methodInstanceName // add name to argument so ti cab be accessed by createModuleInstance.
            self.methodInstance[methodInstanceName] = self.createModuleInstance(argument)
            return self.methodInstance[methodInstanceName]
        } else {
            if(debug) console.log('create without saving !')
            return self.createModuleInstance(argument)
        }
    }
    
}

module.exports = self
