import Application from '../class/Application.class.js'
const ModuleClassContext = require('./method/ModuleClassContext.js')

module.exports = new ModuleClassContext(() => {
    const NestedUnitController = require('./NestedUnitController.class.js').getMethodInstance('ConditionController', {superclass: Application})
    const self = class NestedUnitImplementation extends NestedUnitController {
        constructor(skipConstructor = false) {
            super(true)
            if(skipConstructor) return;
            return this
        }
    }
    return self
})
