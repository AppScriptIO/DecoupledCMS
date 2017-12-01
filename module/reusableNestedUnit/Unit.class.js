import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'

export default ({ Superclass }) => {
    let self = @prototypeChainDebug 
    class RUnit extends Superclass {

        static getDocumentQuery;

        static initializeStaticClass(self, getTableDocument) {
            self.getDocumentQuery = getTableDocument
            super.initializeStaticClassControllerLevel()
        }

        constructor(databaseDocumentKey, AppInstance) {
            super(false, {portAppInstance: AppInstance})
            this.key = databaseDocumentKey
            return this
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
    
    return self
}
