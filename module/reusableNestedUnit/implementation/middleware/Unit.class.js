import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['middleware_middlewareFile'] = getTableDocument.generate('middleware_middlewareFile')
getTableDocument.instance['middleware_middlewareImplementation'] = getTableDocument.generate('middleware_middlewareImplementation')

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })    
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getTableDocument.instance['middleware_middlewareImplementation'] ] 
        })
        @extendedSubclassPattern.Subclass()
        class Unit extends Superclass {
            async pupolateMiddlewareFile() {
                // [1] get valueReturningFile
                let middlewareFileKey = this.middlewareFile
                if (!('functionPath' in this)) {
                    let middlewareFile = await getTableDocument.instance['middleware_middlewareFile'](self.rethinkdbConnection, middlewareFileKey)
                    this.functionPath = middlewareFile.filePath
                }
            }
        }
    
    return self
}