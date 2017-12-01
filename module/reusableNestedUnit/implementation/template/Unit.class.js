import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js'

let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['template_viewImplementation'] = getTableDocument.generate('template_viewImplementation')
getTableDocument.instance['template_templateFile'] = getTableDocument.generate('template_templateFile')

export default ({ Superclass }) => {
    let self = 
        @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
        @execute({
            staticMethod: 'initializeStaticClass', 
            args: [ getTableDocument.instance['template_viewImplementation'] ] 
        })
        @extendedSubclassPattern.Subclass()
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