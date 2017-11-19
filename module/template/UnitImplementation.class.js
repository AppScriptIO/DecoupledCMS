let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['template_viewImplementation'] = getTableDocument.generate('template_viewImplementation')
getTableDocument.instance['template_templateFile'] = getTableDocument.generate('template_templateFile')

module.exports = superclass => {
    const self = class UnitImplementation extends superclass {
        async pupolateTemplateFile() {
            // [1] get valueReturningFile
            let templateFileKey = this.templateFile
            if (!('templateFilePath' in this)) {
                let templateFile = await getTableDocument.instance['template_templateFile'](self.rethinkdbConnection, templateFileKey)
                this.templateFilePath = templateFile.filePath
            }
        }
    }
    self.initializeStaticClass(getTableDocument.instance['template_viewImplementation'])
}