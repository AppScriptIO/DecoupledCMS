import NestedUnitController from './NestedUnitController.class.js'
import commonMethod from './mixin/commonMethod.mixin.js'
import { mix } from 'mixwith'

 const self = class Unit extends mix(NestedUnitController).with(commonMethod) {

    constructor(skipConstructor = false) {
        super(true) 
        if(skipConstructor) return;
    }

 }

 export default self