import NestedUnitController from './NestedUnitController.class.js'

 const self = class Unit extends NestedUnitController {

    constructor(skipConstructor = false) {
        super(true) 
        if(skipConstructor) return;
    }

 }

 export default self