const ModuleClassContext = require('appscript/module/ModuleClassContext')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
import controllerMixin from './controllerMixin.mixin'
const UnitImplementationFunction = require('./UnitImplementation.class.js')
const NestedUnitFunction = require('./NestedUnit.class.js')

let executedNumberUniqueIdentifier = 0 // allows to have a unique set of relations among different nested unit instances.

module.exports = superclass => {
    let cachedUniqueName = 'TemplateController' + executedNumberUniqueIdentifier    
    const cachedReusableNestedUnit = reusableNestedUnit(cachedUniqueName, superclass, controllerMixin)
    const NestedUnit = (new ModuleClassContext(NestedUnitFunction, cachedUniqueName)).proxified
    const UnitImplementation = (new ModuleClassContext(UnitImplementationFunction, cachedUniqueName)).proxified
    UnitImplementation(cachedReusableNestedUnit.Unit)
    NestedUnit(cachedReusableNestedUnit.NestedUnit)
    cachedReusableNestedUnit.Controller.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
    
    executedNumberUniqueIdentifier++ // next function execution will have a different cachedName. This will prevent instances from sharing colliding data.    
    return cachedReusableNestedUnit.Controller
}
