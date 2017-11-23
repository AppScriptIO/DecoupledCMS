import Application from 'appscript'
import renderTemplateDocument from 'appscript/utilityFunction/middleware/renderTemplateDocument.middleware.js'
import implementMiddlewareOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
const MiddlewareController = require('appscript/module/middleware')({superclass: Application})

/**
 * @param {object} Setting holds the json configurations. Where each json is composed of setting.type, setting.name.
 */
export default ({setting}) => {
    return async (context, next) => {
        let isCalledNext = false
        switch(setting.type) {
            case 'middlewareNestedUnit':
                // await context.instance.handleMiddlewareNestedUnit(setting.name) // another way is to create a method in the instance class.        
                const nestedUnitKey = setting.name
                const portAppInstance = context.instance
                let middlewareArray;
                let middlewareController = await new MiddlewareController(false, { portAppInstance: portAppInstance })
                middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: nestedUnitKey })
                await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
                isCalledNext = true
            break;
            case 'functionMiddleware':
                // await context.instance.handleFunctionMiddleware(setting.name)
                let filePath = setting.name
                let middleware = await require(`${filePath}`)
                await middleware(context, next)
                isCalledNext = true
            break;
            case 'portClassMethodMiddleware':
                let methodName = setting.name
                let token = await context.instance[methodName](context.request, context.response)
                context.body = token
            break;
            case 'document':
                const documentKey = setting.name
                await renderTemplateDocument({documentKey})(context, next)
            break;
            case 'consoleLogMessage': 
                console.log(setting.name)
            break;
            default: 
                if(process.env.SZN_DEBUG == 'true') console.log('SZN - %c Setting (callback) doesn\'t match any kind.', Application.config.style.red)
        }
        // if(!isCalledNext) await next()
    }
}
