const ModuleClassContext = require('appscript/module/ModuleClassContext')
import ControllerFunction from './Controller.class.js'
import NestedUnitFunction from './NestedUnit.class.js' // Tree
import UnitFunction from './Unit.class.js' // Unit



function createStaticInstanceClasses(methodInstanceName, superclass, controllerMixin) {
    const Controller = (new ModuleClassContext(ControllerFunction, methodInstanceName)).proxified
    const NestedUnit = (new ModuleClassContext(NestedUnitFunction, methodInstanceName)).proxified
    const Unit = (new ModuleClassContext(UnitFunction, methodInstanceName)).proxified
    
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
