const ModuleClassContext = require('appscript/module/ModuleClassContext')
import ControllerFunction from './Controller.class.js'
import NestedUnitFunction from './NestedUnit.class.js' // Tree
import UnitFunction from './Unit.class.js' // Unit

const Controller = new ModuleClassContext({ target: ControllerFunction })
const NestedUnit = new ModuleClassContext({ target: NestedUnitFunction })
const Unit = new ModuleClassContext({ target: UnitFunction })

function createStaticInstanceClasses({
    methodInstanceName = null, 
    superclass, 
    controllerMixin
}) {
    
    if(methodInstanceName) {
        Controller.moduleContext.cacheName = methodInstanceName
        NestedUnit.moduleContext.cacheName = methodInstanceName
        Unit.moduleContext.cacheName = methodInstanceName
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
