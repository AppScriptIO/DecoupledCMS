import Koa from 'koa' // Koa applicaiton server
import implementConditionActionOnModuleUsingJson from '../../../utility/middleware/implementConditionActionOnModuleUsingJson.js'
import implementMiddlewareOnModuleUsingJson from '../../../utility/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality

let MiddlewareController = createStaticInstanceClasses({ implementationType: 'Middleware', cacheName: true })

let ConditionController = createStaticInstanceClasses({ implementationType: 'Condition', cacheName: true })

let port = 8082
let url = `${self.config.PROTOCOL}api.${self.config.HOST}/`

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
    async (context, next) => {
      // console.log('Reached last middleware')
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) => {
    let httpServer = http.createServer(serverKoa.callback())
    // self.httpServer.on('connection', (socket) => {
    //     console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
    //     socket.on('end', () => { console.info('SOCKET END: other end of the socket sends a FIN packet') })
    //     socket.on('timeout', () => { console.info('SOCKET TIMEOUT') })
    //     socket.on('error', (error) => { console.info('SOCKET ERROR: ' + JSON.stringify(error)) })
    //     socket.on('close', (had_error) => { console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error) })
    // })
    // self.httpServer.setTimeout(0, () => {
    //     console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')
    // })
    httpServer.listen(self.port, () => {
      console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
      resolve()
    })
  })
}
