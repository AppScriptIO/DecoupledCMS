import bodyParser from 'koa-bodyparser'

import ApiClass from 'appscript/class/port/api/Api.class.js'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import { default as Application } from '../../Application.class.js'
import implementConditionActionOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'

let MiddlewareController = createStaticInstanceClasses({ 
    Superclass: Application, 
    implementationType: 'Middleware',
    cacheName: true
})

let ConditionController = createStaticInstanceClasses({
    Superclass: Application, 
    implementationType: 'Condition',
    cacheName: true
})

export default ({} = {}) => () => {
    let Class = ApiClass
    let middlewareArray = [
        createClassInstancePerRequest(Class),
        bodyParser(),
        async (context, next) => {
            context.set('connection', 'keep-alive')
            context.set('Access-Control-Allow-Origin', '*')
            await context.req.setTimeout(30000);                        
            await next()
        },
        // async (context, next) => { // MIDDLEWARE
        //     let middlewareArray;
        //     let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
        //     middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: '43d6e114-54b4-47d8-aa68-a2ae97b961d5' })
        //     await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
        // },
        async (context, next) => {
            let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
            let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: '12e03c10-d9fb-4890-a6e9-51052a8c011f' })
            await implementConditionActionOnModuleUsingJson({setting: callback})(context, next)
        },
    ]
    Class.applyKoaMiddleware(middlewareArray)
    Class.createHttpServer()
}