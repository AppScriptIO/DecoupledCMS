import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from 'appscript/utilityFunction/decoratorUtility.js'

export default ({ Superclass }) => {
    let self =
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
    class RUnit extends Superclass {

        static getDocumentQuery;

        static initializeStaticClass(self, getDocument) {
            self.getDocumentQuery = getDocument
        }

        constructor(databaseDocumentKey) {
            super() 
            this.key = databaseDocumentKey
            return this
        }

        @executeOnceForEachInstance()
        async pupolateUnitWithFile({
            fileKey,
            getDocument, // function
            extract = null // object with two properties - extract: { sourceKey: 'key from source object', destinationKey: 'key to "this" destination' }
         }) {
            let File = await getDocument({
                key: fileKey,
                connection: self.rethinkdbConnection
            })
            if(extract) this[extract.destinationKey] = (extract.sourceKey) ? File[extract.sourceKey] : File;
        }
    }
    
    return self
}
