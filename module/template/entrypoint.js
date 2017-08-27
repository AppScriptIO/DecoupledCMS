const UnitImplementation = require('./UnitImplementation.class.js')
const NestedUnit = require('./NestedUnit.class.js')
import reusableNestedUnit from 'appscript/module/reusableNestedUnit'
import controllerMixin from './controllerMixin.mixin'

module.exports = superclass => {
    const cachedReusableNestedUnit = reusableNestedUnit('TemplateController', superclass, controllerMixin)
    UnitImplementation.getMethodInstance('TemplateController', [cachedReusableNestedUnit.Unit])
    NestedUnit.getMethodInstance('TemplateController', [cachedReusableNestedUnit.NestedUnitImplementation])
    cachedReusableNestedUnit.NestedUnitController.eventEmitter.emit('initializationEnd') // register subclasses that are listening for the event to register themselves in extendedSubclass.static array.
    return cachedReusableNestedUnit.NestedUnitController
}