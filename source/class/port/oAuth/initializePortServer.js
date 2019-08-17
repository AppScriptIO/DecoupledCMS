import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import { class as Application } from '../../Application.class.js'
import OAuthClass from './OAuth.class.js'
import implementMiddlewareOnModuleUsingJson from '../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import implementConditionActionOnModuleUsingJson from '../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import createStaticInstanceClasses from '../../../module/reusableNestedUnit'
import createClassInstancePerRequest from '../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js'

let MiddlewareController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Middleware',
  cacheName: true,
})
let ConditionController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Condition',
  cacheName: true,
})

export default ({} = {}) => async () => {
  let Class = OAuthClass
  // Templating engine & associated extention.
  Class.serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } }))
  let middlewareArray = [
    createClassInstancePerRequest(Class),
    bodyParser(),
    async (context, next) => {
      // instance.middlewareArray.push(middleware)
      // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
      await context.set('Access-Control-Allow-Origin', '*')
      await context.set('connection', 'keep-alive')
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
    async (context, next) => {
      // CONDITION
      let self = Class
      // [1] Create instances and check conditions. Get callback either a function or document
      // The instance responsible for rquests of specific port.
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })

      let entrypointConditionTree = '0681f25c-4c00-4295-b12a-6ab81a3cb440'
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree })
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green)
      // [2] Use callback
      await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)

      if (callback && callback.name == 'post') {
        // for testing purposes.
        let x = await Class.authenticate(context.request, context.response)
        if (x) await next()
      }
    },
    async (context, next) => {
      context.status = 404
      // console.log('Last Middleware reached.')
      await next()
    },
  ]
  Class.applyKoaMiddleware(middlewareArray)
  Class.createHttpServer()
}
