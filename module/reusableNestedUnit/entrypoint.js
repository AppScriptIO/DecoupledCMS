const ModuleContext = require('appscript/module/ModuleContext')
import ControllerFunction from './Controller.class.js'
import NestedUnitFunction from './NestedUnit.class.js' // Tree
import UnitFunction from './Unit.class.js' // Unit

let counter = [] // allows to have a unique set of relations among different nested unit instances.

function createStaticInstanceClasses({
    methodInstanceName = null, 
    superclass, 
    controllerMixin = null
}) {
    let Controller, NestedUnit, Unit;
    
    const MC = (methodInstanceName) ? ModuleContext({ referenceName: methodInstanceName }) : ModuleContext;
    
    Controller = new MC({ target: ControllerFunction })
    NestedUnit = new MC({ target: NestedUnitFunction })
    Unit = new MC({ target: UnitFunction })

    if(methodInstanceName) {
        counter[methodInstanceName] = counter[methodInstanceName] || 0
        Controller.moduleContext.cacheName = `ReusableController${counter[methodInstanceName]}`
        NestedUnit.moduleContext.cacheName = `ReusableNestedUnit${counter[methodInstanceName]}`
        Unit.moduleContext.cacheName = `ReusableUnit${counter[methodInstanceName]}`
        counter[methodInstanceName] ++ 
    }
    
    let cached = {}
    cached['Controller'] = Controller({
        superclass,
        mixin: controllerMixin
    })
    cached['NestedUnit'] = NestedUnit({
        superclass: cached.Controller
    })
    cached['Unit'] = Unit({
        superclass: cached.Controller
    })
    
    return {
        Controller: cached.Controller,
        NestedUnit: cached.NestedUnit,
        Unit: cached.Unit
    }

}

export default createStaticInstanceClasses
