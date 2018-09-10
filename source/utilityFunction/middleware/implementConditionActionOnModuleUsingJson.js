import { default as Application } from '../../class/Application.class.js'
import implementMiddlewareOnModuleUsingJson from './implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import createStaticInstanceClasses from '@dependency/nodeRelationshipGraph'
let MiddlewareController = createStaticInstanceClasses({ 
    Superclass: Application, 
    implementationType: 'Middleware',
    cacheName: true
})

/**
 * @param {object} Setting holds the json configurations. Where each json is composed of setting.type, setting.name.
 */
export default ({
    setting // condition nested unit callback properties's options.
}) => {
    let executionType = setting.type // condition callback property
    return async (context, next) => {
        let isCalledNext = false
        // console.log(setting)
        switch(executionType) {
            case 'middlewareNestedUnit':
                // await context.instance.handleMiddlewareNestedUnit(setting.name) // another way is to create a method in the instance class.        
                const nestedUnitKey = setting.name
                const portAppInstance = context.instance
                let middlewareArray;
                let middlewareController = await MiddlewareController.createContext({ portAppInstance: portAppInstance })
                middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: nestedUnitKey })
                if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') { // print middleware file paths 
                    console.group(`🍊 Middleware Array:`)
                    middlewareArray.map(middlewareNode => {
                        console.log(middlewareNode.file.filePath)
                    })
                    console.groupEnd()
                }
                await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
                isCalledNext = true
            break;
            case 'functionMiddleware':
                // await context.instance.handleFunctionMiddleware(setting.name)
                let filePath = setting.name
                let middleware = await require(`${filePath}`).default
                await middleware(context, next)
                isCalledNext = true
            break;
            case 'portClassMethodMiddleware':
                let methodName = setting.name
                let token = await context.instance[methodName](context.request, context.response)
                context.body = token
            break;
            case 'consoleLogMessage': 
                console.log(setting.name)
            break;
            default: 
                if(process.env.SZN_DEBUG == 'true') console.log('SZN - %c Setting (callback) doesn\'t match any kind.', Application.config.style.red)
        }
        return isCalledNext
    }
}
