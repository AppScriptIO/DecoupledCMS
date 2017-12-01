import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute } from 'appscript/utilityFunction/decoratorUtility.js'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['template_viewImplementation'] = getTableDocument.generate('template_viewImplementation')
getTableDocument.instance['template_templateFile'] = getTableDocument.generate('template_templateFile')

module.exports = ({ Superclass }) => {
    let self = 
        @prototypeChainDebug
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getTableDocument.instance['template_viewImplementation'] ] 
        })
        class Unit extends Superclass {
            async pupolateTemplateFile() {
                // [1] get valueReturningFile
                let templateFileKey = this.templateFile
                if (!('templateFilePath' in this)) {
                    let templateFile = await getTableDocument.instance['template_templateFile'](self.rethinkdbConnection, templateFileKey)
                    this.templateFilePath = templateFile.filePath
                }
            }
        }
    
    return self
}