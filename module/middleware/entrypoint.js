const ModuleContext = require('appscript/module/ModuleContext')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
const UnitImplementationFunction = require('./UnitImplementation.class.js')
const NestedUnitFunction = require('./NestedUnit.class.js')
import controllerMixin from './controllerMixin.mixin'

let counter = 0 // allows to have a unique set of relations among different nested unit instances.

const ModuleContextClass = ModuleContext({ referenceName: 'Middleware' })

module.exports = superclass => {

    const NestedUnit = new ModuleContextClass({ 
        target: NestedUnitFunction, 
        cacheName: `NestedUnit${counter}` 
    })
    const UnitImplementation = new ModuleContextClass({
        target: UnitImplementationFunction, 
        cacheName: `Unit${counter}` 
    })

    const cachedReusableNestedUnit = reusableNestedUnit({
        methodInstanceName: 'Middleware', 
        superclass, 
        controllerMixin 
    })
    
    NestedUnit(cachedReusableNestedUnit.NestedUnit)
    UnitImplementation(cachedReusableNestedUnit.Unit)
    cachedReusableNestedUnit.Controller.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.

    counter++ // next function execution will have a different cachedName. This will prevent instances from sharing colliding data.
    return cachedReusableNestedUnit.Controller
}