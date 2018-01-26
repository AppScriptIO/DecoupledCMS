import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional, executeOnceForEachInstance } from 'appscript/utilityFunction/decoratorUtility.js'
import assert from 'assert'

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
            assert.strictEqual(Object.getPrototypeOf(self.rethinkdbConnection).constructor.name, 'TcpConnection')
            let file = await getDocument({ key: fileKey, connection: self.rethinkdbConnection })
            if(extract) this[extract.destinationKey] = (extract.sourceKey) ? file[extract.sourceKey] : file;
        }
    }
    
    return self
}
