const ModuleClassContext = require('appscript/module/ModuleClassContext')
import { NestedUnitController } from 'appscript/module/reusableNestedUnit'

module.exports = new ModuleClassContext(superclass => {
    const Class = NestedUnitController.getMethodInstance('ConditionController', {superclass: superclass})
    const Condition = require('./Condition.class.js').getMethodInstance('Condition', {superclass: superclass})
    const ConditionTree = require('./ConditionTree.class.js').getMethodInstance('ConditionTree', {superclass: superclass})
    return Class
})