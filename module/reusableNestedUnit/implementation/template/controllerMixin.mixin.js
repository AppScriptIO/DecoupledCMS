import { Mixin } from 'mixwith'
import _ from 'underscore'
import { default as Application } from '../../../../class/Application.class.js'
import filesystem from 'fs'
import { classDecorator as prototypeChainDebug} from 'appscript/module/prototypeChainDebug'
import { add, execute, applyMixin, conditional } from 'appscript/utilityFunction/decoratorUtility.js'
import assert from "assert"

/**
 * @description Extends a class by super class and adds some common functionality.
 */
export default Mixin(({ Superclass }) => {
    let self = 
    @conditional({ decorator: prototypeChainDebug, condition: process.env.SZN_DEBUG })
    class TemplateMixin extends Superclass {
        
        /**
         * 
         * @return {String} String of rendered HTML document content.
         */
        async initializeNestedUnit({ nestedUnitKey, additionalChildNestedUnit = [], pathPointerKey = null }) { // Entrypoint Instance
            assert(nestedUnitKey, '• Key should be present. The passed value is either undefined, null, or empty string.')

            // [1] get nestedUnit
            let nestedUnitInstance = await this.getNestedUnit({ nestedUnitKey, additionalChildNestedUnit, pathPointerKey })
            // [2] get unit.
            let { unitKey: unitKey } = nestedUnitInstance
            let unitInstance = await this.getUnit({ unitKey })
            await unitInstance.pupolateUnitWithFile()
            
            // views argument that will be initiallized inside templates:
            // let view = {}
            let templateFunction = _.template(await filesystem.readFileSync(`${this.portAppInstance.config.clientBasePath}/${unitInstance.file.filePath}`, 'utf-8'))
            // Shared arguments between all templates being rendered
            // loop through template and create rendered view content.
            let view = await nestedUnitInstance.loopInsertionPoint({ type: 'aggregateIntoTemplateObject' })
                       
            const templateArgument = {
                templateController: this,
                context: this.portAppInstance.context,
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

        renderedContentString(viewName, viewArray) {
            // loop throught the strings array to combine them and print string code to the file.            
            if(viewArray[viewName] && Array.isArray(viewArray[viewName])) {
                return viewArray[viewName].join('') // joins all array components into one string.
            }
        }

    }

    return self
})