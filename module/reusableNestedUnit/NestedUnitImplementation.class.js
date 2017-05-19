import Application from 'appscript/class/Application.class.js'
const ModuleClassContext = require('appscript/module/ModuleClassContext')

module.exports = new ModuleClassContext((superclass = Application) => {
    const NestedUnitController = require('./NestedUnitController.class.js').getMethodInstance('ConditionController', {superclass: superclass})
    const self = class NestedUnitImplementation extends NestedUnitController {
        constructor(skipConstructor = false) {
            super(true)
            if(skipConstructor) return;
            return this
        }
    }
    return self
})
