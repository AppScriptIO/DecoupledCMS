import { Mixin } from 'mixwith'
import _ from 'underscore'
import { default as Application } from 'appscript'
import filesystem from 'fs'
import prototypeChainDebug from 'appscript/module/prototypeChainDebug'

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ superclass }) => {
    let self = class TemplateMixin extends superclass {

        renderedContentString(viewName, viewArray) {
            // loop throught the strings array to combine them and print string code to the file.
            if(viewArray[viewName]) {
                return viewArray[viewName].join() // joins all array components into one string.
            }
        }
        
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) { // Entrypoint Instance
            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            // [2] get unit.
            let { viewImplementation: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnit({ unitKey })
            await unitInstance.pupolateTemplateFile()
            
            // views argument that will be initiallized inside templates:
            // let view = {}
            let templateFunction = _.template(await filesystem.readFileSync(`${this.AppInstance.config.clientBasePath}/${unitInstance.templateFilePath}`, 'utf-8'))
            // Shared arguments between all templates being rendered

            // loop through template and create rendered view content.
            let view = await nestedUnitInstance.loopInsertionPoint()

            const templateArgument = {
                templateController: this,
                context: this.AppInstance.context,
                Application,
                argument: {}
            }
            let renderedContent = templateFunction(
                Object.assign(
                    {}, 
                    templateArgument, 
                    { view, templateArgument }
                )
            )
            return renderedContent
        }
    }
    self = prototypeChainDebug(self)
    return self
})