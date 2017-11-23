let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['template_viewImplementation'] = getTableDocument.generate('template_viewImplementation')
getTableDocument.instance['template_templateFile'] = getTableDocument.generate('template_templateFile')

module.exports = superclass => {
    let self = class UnitImplementation extends superclass {
        async pupolateTemplateFile() {
            // [1] get valueReturningFile
            let templateFileKey = this.templateFile
            if (!('templateFilePath' in this)) {
                let templateFile = await getTableDocument.instance['template_templateFile'](self.rethinkdbConnection, templateFileKey)
                this.templateFilePath = templateFile.filePath
            }
        }
    }
    self.initializeStaticClassControllerLevel(getTableDocument.instance['template_viewImplementation'])

    self.prototype.meta = {
        description: 'TemplateUnit prototype object'
    }
    self = new Proxy(self, {
        construct: function(target, argumentsList, newTarget) {
            let instance = newTarget(...argumentsList)
            instance.meta = {
                description: 'TemplateUnit instance/object'
            }
            return instance 
        },
        apply: function(target, thisArg, argumentsList) {
            let instance = target.call(thisArg, ...argumentsList)
            instance.meta = {
                description: 'TemplateUnit instance/object'
            }
            return instance
        }
    });

    return self
}