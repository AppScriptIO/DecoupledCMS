const ModuleClassContext = require('appscript/module/ModuleClassContext')
let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['middleware_middlewareFile'] = getTableDocument.generate('middleware_middlewareFile')
getTableDocument.instance['middleware_middlewareImplementation'] = getTableDocument.generate('middleware_middlewareImplementation')

module.exports = new ModuleClassContext((methodInstanceName, superclass) => {
    const self = class UnitImplementation extends superclass {
        async pupolateMiddlewareFile() {
            // [1] get valueReturningFile
            let middlewareFileKey = this.middlewareFile
            if (!('functionPath' in this)) {
                let middlewareFile = await getTableDocument.instance['middleware_middlewareFile'](self.rethinkdbConnection, middlewareFileKey)
                this.functionPath = middlewareFile.filePath
            }
        }
    }
    self.initializeStaticClass(getTableDocument.instance['middleware_middlewareImplementation'])
})