import NestedUnitImplementation from './NestedUnitImplementation.class.js' // Tree
import Unit from './Unit.class.js' // Unit
import NestedUnitController from './NestedUnitController.class.js'

function createStaticInstanceClasses(methodInstanceName, superclass, controllerMixin) {
    const CachedNestedUnitController = NestedUnitController.getMethodInstance(methodInstanceName, [superclass, controllerMixin])
    const CachedUnit = Unit.getMethodInstance(methodInstanceName, [CachedNestedUnitController])
    const CachedNestedUnitImplementation = NestedUnitImplementation.getMethodInstance(methodInstanceName, [CachedNestedUnitController])
    
    return {
        NestedUnitController: CachedNestedUnitController,
        NestedUnitImplementation: CachedNestedUnitImplementation,
        Unit: CachedUnit
    }
}

export default createStaticInstanceClasses
