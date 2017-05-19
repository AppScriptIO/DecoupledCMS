import Application from 'appscript/class/Application.class.js'
const ModuleClassContext = require('appscript/module/ModuleClassContext')

module.exports = new ModuleClassContext((superclass = Application) => {
    const contextClass = require('./NestedUnitController.class.js')
    const NestedUnitController = contextClass.getMethodInstance('ConditionController', {superclass: superclass});
    const self = class Unit extends NestedUnitController {
        constructor(skipConstructor = false) {
            super(true) 
            if(skipConstructor) return;
        }
    }
    return self
})
