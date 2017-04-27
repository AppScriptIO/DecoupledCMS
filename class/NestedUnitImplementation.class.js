import NestedUnitController from './NestedUnitController.class.js'

const self = class NestedUnitImplementation extends NestedUnitController {

    constructor(skipConstructor = false) {
        super(true)
        if(skipConstructor) return;
        return this
    }

}

export default self