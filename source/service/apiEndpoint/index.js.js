import Koa from 'koa' // Koa applicaiton server
import implementConditionActionOnModuleUsingJson from '../../../utility/middleware/implementConditionActionOnModuleUsingJson.js'
import implementMiddlewareOnModuleUsingJson from '../../../utility/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'

let MiddlewareController = createStaticInstanceClasses({ implementationType: 'Middleware', cacheName: true })
let ConditionController = createStaticInstanceClasses({ implementationType: 'Condition', cacheName: true })

;async () => {
  // createKoaServer
  let serverKoa = new Koa() // export if script is required.
  if (self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost

  // applyKoaMiddleware
  let middlewareArray = [
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    async (context, next) => {
      // MIDDLEWARE e.g. body parser
      let middlewareArray
      let middlewareController = await MiddlewareController.createContext()
      middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: '84sfad-f783-410e-a5c9-a21679a45beb' })
      await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
    },
    async (context, next) => {
      let conditionController = await ConditionController.createContext()
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' })
      let isCalledNext = await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
      if (!isCalledNext) await next()
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) => {
    let httpServer = http.createServer(serverKoa.callback())
    httpServer.listen(2, () => {
      console.log(`☕%c ${self.name} listening on port ${2}`, consoleLogStyle.style.green)
      resolve()
    })
  })
}
