const ModuleClassContext = require('appscript/module/ModuleClassContext')
import getTableDocument from 'appscript/utilityFunction/database/query/getTableDocument.query.js'
const templateFileDatabase = getTableDocument('templateFile')

module.exports = new ModuleClassContext((methodInstanceName, superclass) => {
    const self = class UnitImplementation extends superclass {
        async pupolateTemplateFile() {
            // [1] get valueReturningFile
            let templateFileKey = this.templateFile
            if (!('templateFilePath' in this)) {
                let templateFile = await templateFileDatabase(self.rethinkdbConnection, templateFileKey)
                this.templateFilePath = templateFile.filePath
            }
        }
    }
    self.initializeStaticClass(getTableDocument('viewImplementation'))
})