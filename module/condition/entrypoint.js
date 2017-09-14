const UnitImplementation = require('./UnitImplementation.class.js')
const NestedUnit = require('./NestedUnit.class.js')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
import controllerMixin from './controllerMixin.mixin'
let executedNumberUniqueIdentifier = 0 // allows to have a unique set of relations among different nested unit instances.

module.exports = superclass => {
    let cachedUniqueName = 'ConditionController' + executedNumberUniqueIdentifier
    const cachedReusableNestedUnit = reusableNestedUnit(cachedUniqueName, superclass, controllerMixin)
    UnitImplementation.getMethodInstance(cachedUniqueName, [cachedReusableNestedUnit.Unit])
    NestedUnit.getMethodInstance(cachedUniqueName, [cachedReusableNestedUnit.NestedUnitImplementation])
    cachedReusableNestedUnit.NestedUnitController.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.

    executedNumberUniqueIdentifier++ // next function execution will have a different cachedName. This will prevent instances from sharing colliding data.
    return cachedReusableNestedUnit.NestedUnitController
}
