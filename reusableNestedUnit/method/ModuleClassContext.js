const self = class ModuleClassContext {

    methodInstance = [];

    constructor(createModuleInstance) {
        this.createModuleInstance = createModuleInstance
    }

    getMethodInstance(methodInstanceName = null, argument, importerName = null) {
        let moduleInstance;
        let debug = (importerName) ? true : false;
        if(debug) console.log(importerName) // Debug purposes to check which file impoerted it.
        if(methodInstanceName && typeof this.methodInstance[methodInstanceName] !== 'undefined')  {
            if(debug) console.log('already defined !')
            return this.methodInstance[methodInstanceName]
        } else if(methodInstanceName) {
            if(debug) console.log('create new instance !')
            this.methodInstance[methodInstanceName] = this.createModuleInstance(argument)
            return this.methodInstance[methodInstanceName]
        } else {
            if(debug) console.log('create without saving !')
            return this.createModuleInstance(argument)
        }
    }
    
}

module.exports = self
