import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import { default as Application } from '../../Application.class.js'
import StaticContentClass from 'appscript/class/port/staticContent/StaticContent.class.js'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import implementMiddlewareOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
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

export default ({entrypointConditionKey} = {}) => async () => {
    let Class = StaticContentClass
    // Templating engine & associated extention.
    Class.serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } } ))
    let middlewareArray = [
        createClassInstancePerRequest(Class),
        bodyParser(),        
        async (context, next) => {
            // instance.middlewareArray.push(middleware)
            // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).          
            await context.set('Access-Control-Allow-Origin', '*')
            await context.set('connection', 'keep-alive')

            // // Authorization access example:
            // let token = await OAuthClass.authenticateMiddleware()(context.request, context.response);
            // if(token) {
            //     await next()
            // } else {
            //     console.log('Sorry unauthorized access')
            // }

            await next()
        },
        async (context, next) => {
            // let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
            // await wait(500)
            let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
            let middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec' })
            await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)

            // context.instance.config.clientBasePath = await Application.config.clientBasePath
            // await next()          
        },
        // async (context, next) => {
        //     let self = Class
        //     // [1] Create instances and check conditions. Get callback either a function or document
        //     // The instance responsible for rquests of specific port.
        //     let conditionController = await new ConditionController(false, { portAppInstance: context.instance})
        //     let entrypointConditionKey = '78f91938-f9cf-4cbf-9bc8-f97836ff23dd'
        //     if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionKey} \n \n`)
        //     let callback = await conditionController.initializeNestedUnit({nestedUnitKey: entrypointConditionKey})
        //     // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
        //     // [2] Use callback
        //     if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green)
        //     if(!callback) console.log('condition checking failed !')
        //     if(callback.name == '') {
        //         console.log(callback)
        //         callback = { name: 'a7912856-ad5a-46b0-b980-67fb500af399', type: 'middlewareNestedUnit' }
        //     }
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
        },
    ]
    Class.applyKoaMiddleware(middlewareArray)
    Class.createHttpServer()
}