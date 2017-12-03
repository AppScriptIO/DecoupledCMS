import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'

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
    }
    
    return self
}
