import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['middleware_middlewareFile'] = getTableDocument.generate('middleware_middlewareFile')
getTableDocument.instance['middleware_middlewareImplementation'] = getTableDocument.generate('middleware_middlewareImplementation')

module.exports = ({ superclass }) => {
    let self = class Unit extends superclass {
        async pupolateMiddlewareFile() {
            // [1] get valueReturningFile
            let middlewareFileKey = this.middlewareFile
            if (!('functionPath' in this)) {
                let middlewareFile = await getTableDocument.instance['middleware_middlewareFile'](self.rethinkdbConnection, middlewareFileKey)
                this.functionPath = middlewareFile.filePath
            }
        }
    }
    self.initializeStaticClassControllerLevel(getTableDocument.instance['middleware_middlewareImplementation'])
    self = prototypeChainDebug(self)
    
    return self
}