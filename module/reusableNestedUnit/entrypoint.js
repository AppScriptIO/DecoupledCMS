const ModuleContext = require('appscript/module/ModuleContext')
import ControllerFunction from './Controller.class.js'
import NestedUnitFunction from './NestedUnit.class.js' // Tree
import UnitFunction from './Unit.class.js' // Unit

let counter = [] // allows to have a unique set of relations among different nested unit instances.

function createStaticInstanceClasses({
    methodInstanceName = null, 
    superclass, 
    controllerMixin
}) {  
    let Controller, NestedUnit, Unit;
    if(methodInstanceName) {
        const ModuleContextClass = ModuleContext({ referenceName: methodInstanceName })
        counter[methodInstanceName] = counter[methodInstanceName] || 0
        Controller = new ModuleContextClass({ 
            target: ControllerFunction, 
            cacheName: `ReusableController${counter[methodInstanceName]}` 
        })
        NestedUnit = new ModuleContextClass({ 
            target: NestedUnitFunction, 
            cacheName: `ReusableNestedUnit${counter[methodInstanceName]}`
        })
        Unit = new ModuleContextClass({ 
            target: UnitFunction,
            cacheName: `ReusableUnit${counter[methodInstanceName]}`
        })
        counter[methodInstanceName] ++ 
    } else {
        Controller = new ModuleContext({ target: ControllerFunction })
        NestedUnit = new ModuleContext({ target: NestedUnitFunction })
        Unit = new ModuleContext({ target: UnitFunction })
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
