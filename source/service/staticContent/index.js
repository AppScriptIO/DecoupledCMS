// Static content server - could be upgraded to Content Delivery Network
import koaViews from 'koa-views'
import Koa from 'koa' // Koa applicaiton server

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

;async () => {
  let port = 8081
  let url = `${self.config.PROTOCOL}cdn.${self.config.HOST}`
  let entrypointConditionKey
  // Templating engine & associated extention.
  // applyKoaMiddleware
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
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
    async (context, next) => {
      // CONDITION
      // [1] Create instances and check conditions. Get callback either a function or document
      // The instance responsible for rquests of specific port.
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionKey} \n \n`)
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionKey })
      // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
      // [2] Use callback
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green)
      await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
    },
    async (context, next) => {
      // console.log('Last Middleware reached.')
      await next()
      context.compress = true
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
