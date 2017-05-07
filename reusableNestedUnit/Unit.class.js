import Application from '../class/Application.class.js'
const ModuleClassContext = require('./method/ModuleClassContext.js')

module.exports = new ModuleClassContext(() => {
    const contextClass = require('./NestedUnitController.class.js')
    const NestedUnitController = contextClass.getMethodInstance('ConditionController', {superclass: Application});
    const self = class Unit extends NestedUnitController {
        constructor(skipConstructor = false) {
            super(true) 
            if(skipConstructor) return;
        }

    }
    return self
})
