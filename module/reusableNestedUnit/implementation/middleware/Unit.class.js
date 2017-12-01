import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute } from 'appscript/utilityFunction/decoratorUtility.js'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['middleware_middlewareFile'] = getTableDocument.generate('middleware_middlewareFile')
getTableDocument.instance['middleware_middlewareImplementation'] = getTableDocument.generate('middleware_middlewareImplementation')

export default ({ Superclass }) => {
    let self = 
        @prototypeChainDebug
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getTableDocument.instance['middleware_middlewareImplementation'] ] 
        })
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