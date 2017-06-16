const ModuleClassContext = require('appscript/module/ModuleClassContext')
import getTableDocument from 'appscript/utilityFunction/database/query/getTableDocument.query.js'
const middlewareFileDatabase = getTableDocument('middlewareFile')

module.exports = new ModuleClassContext((methodInstanceName, superclass) => {
    const self = class UnitImplementation extends superclass {
        async pupolateMiddlewareFile() {
            // [1] get valueReturningFile
            let middlewareFileKey = this.middlewareFile
            if (!('functionPath' in this)) {
                let middlewareFile = await middlewareFileDatabase(self.rethinkdbConnection, middlewareFileKey)
                this.functionPath = middlewareFile.filePath
            }
        }
    }
    self.initializeStaticClass(getTableDocument('middlewareImplementation'))
})