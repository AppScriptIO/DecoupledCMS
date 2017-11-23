import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

module.exports = ({ superclass }) => {
    let self = class Unit extends superclass {
        constructor(databaseDocumentKey, AppInstance) {
            super(false, {portAppInstance: AppInstance})
            this.key = databaseDocumentKey
            return this
        }
        static getDocumentQuery;
        static initializeStaticClassControllerLevel(getTableDocument) {
            let Class = this
            Class.eventEmitter.on('initializationEnd', () => {
                let ClassObject = {}
                ClassObject[`${Class.name}`] = Class
                Class.addStaticSubclassToClassArray(ClassObject)
            })
            self.getDocumentQuery = getTableDocument
        }
        /**
         * @description gets document from database using documentKey and populates the data to the instance.
         * 
         */
        async initializeInstance() {
            let Class = this.constructor
            if(!('jsonData' in this)) { // if not already populated with data.
                let jsonData = await Class.getDocumentQuery(Class.rethinkdbConnection, this.key)
                await this.populateInstancePropertyFromJson_this(jsonData)
            }
        }
    }
    self = prototypeChainDebug(self)
    
    return self

}
