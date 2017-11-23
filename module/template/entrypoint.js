const ModuleContext = require('appscript/module/ModuleContext')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
import controllerMixin from './controllerMixin.mixin'
const UnitImplementationFunction = require('./UnitImplementation.class.js')
const NestedUnitFunction = require('./NestedUnit.class.js')

let counter = 0 // allows to have a unique set of relations among different nested unit instances.

module.exports = superclass => {

    const NestedUnit = new ModuleContext({
        target: NestedUnitFunction
    })
    const UnitImplementation = new ModuleContext({
        target: UnitImplementationFunction
    })

    const cachedReusableNestedUnit = reusableNestedUnit({ 
        superclass, 
        controllerMixin // is passed as one instance to all calls
    })
    
    UnitImplementation(cachedReusableNestedUnit.Unit)
    NestedUnit(cachedReusableNestedUnit.NestedUnit)
    cachedReusableNestedUnit.Controller.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
    
    counter++ // next function execution will have a different cachedName. This will prevent instances from sharing colliding data.    
    return cachedReusableNestedUnit.Controller
}
