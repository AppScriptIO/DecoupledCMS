import Application from './Application.class.js'
import commonMethod from './mixin/commonMethod.mixin.js'
import { mix } from 'mixwith'

 const self = class NestedUnitController extends Application {

    AppInstance; // calling instance that contains the context
    instance = {
        ConditionTree: [],
        Condition: [],
    } // conditionTreeKey -> { Json data, properties } 

    constructor(skipConstructor = false) {
        super(true) 
        if(skipConstructor) return;
    }

    async initializeConditionTree(conditionTreeKey, AppInstance) { // Entrypoint Instance
        this.AppInstance = AppInstance
        const ConditionTree = self.extendedSubclass.static['ConditionTree']
        // self.debug.push(conditionTreeKey)
        let conditionTreeInstance = await ConditionTree.createInstance(this.instance.ConditionTree, conditionTreeKey, ConditionTree.getDocumentQuery)
        // [2] Check condition.
        let conditionKey = conditionTreeInstance.conditionImplementation
        let result = await this.initializeCondition(conditionKey)
        // [3] Iterate over insertion points
        let callback = false;
        if(result) {
            // get callback from subtrees
            for (let insertionPoint of conditionTreeInstance.insertionPoint) {
                callback = await conditionTreeInstance.initializeInsertionPoint(insertionPoint, this)
                if(callback) break
            }
            // if all subtress rejected, get immediate callback
            if(!callback && 'callback' in  conditionTreeInstance) {
                callback = conditionTreeInstance.callback // fallback to immediate callback of instance.        
            }
        }
        // [4] Callback
        return callback
    }

    async initializeCondition(conditionKey) {
        // self.debug.push(conditionKey)
        // [1] Instance.
        let Condition = self.extendedSubclass.static['Condition']
        let conditionInstance = await Condition.createInstance(this.instance.Condition, conditionKey, Condition.getDocumentQuery)
        // [2] Check condition
        return await conditionInstance.checkCondition(this.AppInstance)
    }

 }

 export default self