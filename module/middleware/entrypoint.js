const ModuleClassContext = require('appscript/module/ModuleClassContext')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
const UnitImplementationFunction = require('./UnitImplementation.class.js')
const NestedUnitFunction = require('./NestedUnit.class.js')
import controllerMixin from './controllerMixin.mixin'

let executedNumberUniqueIdentifier = 0 // allows to have a unique set of relations among different nested unit instances.

const UnitImplementation = new ModuleClassContext({ target: UnitImplementationFunction })
const NestedUnit = new ModuleClassContext({ target: NestedUnitFunction })

module.exports = superclass => {
    let cachedUniqueName = 'MiddlewareController' + executedNumberUniqueIdentifier    
    const cachedReusableNestedUnit = reusableNestedUnit({ methodInstanceName: cachedUniqueName, superclass, controllerMixin })
    NestedUnit.moduleContext.cacheName = cachedUniqueName
    UnitImplementation.moduleContext.cacheName = cachedUniqueName
    
    UnitImplementation(cachedReusableNestedUnit.Unit)
    NestedUnit(cachedReusableNestedUnit.NestedUnit)
    cachedReusableNestedUnit.Controller.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.

    executedNumberUniqueIdentifier++ // next function execution will have a different cachedName. This will prevent instances from sharing colliding data.
    return cachedReusableNestedUnit.Controller
}