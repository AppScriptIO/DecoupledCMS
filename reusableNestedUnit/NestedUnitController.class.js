import commonMethod from './mixin/commonMethod.mixin.js'
import { mix } from 'mixwith'
const ModuleClassContext = require('./method/ModuleClassContext.js')

module.exports = new ModuleClassContext((argument) => {
    const superclass = argument['superclass']
    const self = class NestedUnitController extends mix(superclass).with(commonMethod) {
        static extendedSubclass = {
            static: []
        }
        AppInstance; // calling instance that contains the context
        instance = {
            ConditionTree: [],
            Condition: [],
        } // conditionTreeKey -> { Json data, properties } 

        constructor(skipConstructor = false) {
            super(true)
            if(skipConstructor) return;
        }
        static initializeStaticClass() {
            if(argument.methodInstanceName) {
                superclass.eventEmitter.on('initializationEnd', () => {
                    let ClassObject = {}
                    ClassObject[`${argument.methodInstanceName}`] = self
                    superclass.addStaticSubclassToClassArray(ClassObject)
                })
            }
        }
        async initializeConditionTree(conditionTreeKey, portAppInstance) { // Entrypoint Instance
            this.AppInstance = portAppInstance
            // self.debug.push(conditionTreeKey)
            // let conditionTreeInstance = await ConditionTree.createInstance(this.instance.ConditionTree, conditionTreeKey, ConditionTree.getDocumentQuery)
            let conditionTreeInstance;
            if(!(conditionTreeKey in this.instance.ConditionTree)) {
                conditionTreeInstance = await new self.extendedSubclass.static['ConditionTree'](conditionTreeKey)
                await conditionTreeInstance.initializeConditionTree()
                this.instance.ConditionTree[conditionTreeKey] = conditionTreeInstance
            } else {
                conditionTreeInstance = this.instance.ConditionTree[conditionTreeKey]
            }

            // [2] Check condition.
            let conditionKey = conditionTreeInstance.conditionImplementation
            let conditionInstance;
            if(!(conditionKey in this.instance.Condition)) {
                conditionInstance = await new self.extendedSubclass.static['Condition'](conditionKey)
                await conditionInstance.initializeCondition()
                this.instance.Condition[conditionKey] = conditionInstance
            } else {
                conditionInstance = this.instance.Condition[conditionKey]
            }

            let result = conditionInstance.checkCondition(this.AppInstance)
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
    self.initializeStaticClass()
    return self
})

