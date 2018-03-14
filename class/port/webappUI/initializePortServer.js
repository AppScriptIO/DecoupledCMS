import views from 'koa-views'
import bodyParser from 'appscript/utilityFunction/middleware/bodyParser.middleware.js'
import { default as Application } from '../../Application.class.js'
import WebappUIClass from 'appscript/class/port/webappUI/WebappUI.class.js'
import debugLogMiddleNestedUnitStructure from 'appscript/utilityFunction/debugLogMiddlewareNestedUnitStructure.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
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
    let Class = WebappUIClass
    // Templating engine & associated extention.
    Class.serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } } ))
    let middlewareArray = [
        createClassInstancePerRequest(Class),
        bodyParser(),
        async (context, next) => {
            // await context.req.setTimeout(0);            
            // instance.middlewareArray.push(middleware)
            context.set('connection', 'keep-alive')
            await next()
        },
        async (context, next) => { // TODO: Transfer to separate middleware file and add to nested unit system.
            let urlQuery = context.request.query
            let queryLanguage = (urlQuery.language) ?
                urlQuery.language.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter.
                : null ;
            context.frontendPerContext = {
                setting: { 
                    mode: { 
                        language: queryLanguage || Application.frontend.setting.mode.language 
                    } 
                } 
            }
            await next()
        },
        async (context, next) => { // add middleware sequence for fast testing.
            // debugLogMiddleNestedUnitStructure('91140de5-9ab6-43cd-91fd-9eae5843c74c') 
            let middlewareSequence = [
                    // {
                    //     name: 'applyConditionCallback',
                    //     entrypointConditionTreeKey: 'default',
                    //     functionPath: ''
                    // }
            ]
            await implementMiddlewareOnModuleUsingJson(middlewareSequence)
            await next()
        },            
        async (context, next) => { // MIDDLEWARE
            let middlewareArray;
            let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
            middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: '43d6e114-54b4-47d8-aa68-a2ae97b961d5' })
            await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
        },
        async (context, next) => { // CONDITION
            let self = Class
            // [1] Create instances and check conditions. Get callback either a function or document
            // The instance responsible for rquests of specific port.
            let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
            let entrypointConditionTree = entrypointConditionKey || self.entrypointSetting.defaultConditionTreeKey
            if(process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
            let callback = await conditionController.initializeNestedUnit({nestedUnitKey: entrypointConditionTree})
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