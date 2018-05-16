import views from 'koa-views'
import { default as Application } from '../../Application.class.js'
import StaticContentClass from 'appscript/class/port/staticContent/StaticContent.class.js'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import implementMiddlewareOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import implementConditionActionOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import koaCompress from 'koa-compress'
import zlib from 'zlib'

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

export default ({entrypointConditionKey} = {}) => async () => {
    let Class = StaticContentClass
    // Templating engine & associated extention.
    Class.serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } } ))
    let middlewareArray = [
        createClassInstancePerRequest(Class),
        // async (context, next) => {
        //     // // Authorization access example:
        //     // let token = await OAuthClass.authenticateMiddleware()(context.request, context.response);
        //     // if(token) {
        //     //     await next()
        //     // } else {
        //     //     console.log('Sorry unauthorized access')
        //     // }
        //     await next()
        // },
        async (context, next) => { // CONDITION
            let self = Class
            // [1] Create instances and check conditions. Get callback either a function or document
            // The instance responsible for rquests of specific port.
            let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
            if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionKey} \n \n`)
            let callback = await conditionController.initializeNestedUnit({nestedUnitKey: entrypointConditionKey})
            // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
            // [2] Use callback
            if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green)
            await implementConditionActionOnModuleUsingJson({setting: callback})(context, next)
        }, 
        async (context, next) => {
            // console.log('Last Middleware reached.')
            await next()
            context.compress = true
        },
        koaCompress({
            flush: zlib.Z_SYNC_FLUSH
        })
    ]
    Class.applyKoaMiddleware(middlewareArray)
    Class.createHttpServer()
}