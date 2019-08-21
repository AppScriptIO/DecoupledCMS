import filesystem from 'fs'
import https from 'https'
import http from 'http'
import underscore from 'underscore'
import koaViews from 'koa-views'
import Koa from 'koa' // Koa applicaiton server
import serviceConfig from './configuration.js'
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'
import implementConditionActionOnModuleUsingJson from '../../utility/middleware/implementConditionActionOnModuleUsingJson.js'
import { Graph as GraphModule } from '@dependency/graphTraversal'
const { Graph } = GraphModule

let configuredGraph = Graph.clientInterface({})
let graph = new configuredGraph({})

export async function initialize({ targetProjectConfig }) {
  let entrypointKey = 'default'

  let serverKoa = new Koa() // export if script is required.
  serverKoa.subdomainOffset = 1 // for localhost domain.
  ;[
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      await next()
    },
    async (context, next) => {
      if (context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointKey} \n \n`)
      let callbackOption = await graph.traverse({ nodeKey: entrypointKey })

      if (context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callbackOption.name}`, consoleLogStyle.green)

      await implementConditionActionOnModuleUsingJson({ setting: callbackOption })(context, next)
    },
  ] |> (middlewareArray => middlewareArray.forEach(middleware => serverKoa.use(middleware)))

  http
    .createServer(serverKoa.callback())
    .on('connection', socket => {
      // console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
      // socket.on('end', () => console.info('SOCKET END: other end of the socket sends a FIN packet'))
      // socket.on('timeout', () => console.info('SOCKET TIMEOUT'))
      // socket.on('error', error => console.info('SOCKET ERROR: ' + JSON.stringify(error)))
      // socket.on('close', had_error => console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error))
    })
    .setTimeout(0, () => console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!'))
    .listen(serviceConfig.port, () => {
      if (process.send !== undefined) process.send({ message: 'Server listening' }) // if process is a forked child process.
      // eventEmitter.emit('listening')
      // process.emit('listening')
      console.log(`☕%c ${serviceConfig.name} listening on port ${serviceConfig.port}`, consoleLogStyle.green)
    })

  if (serviceConfig.ssl)
    https
      .createServer({ key: serviceConfig.ssl.key, cert: serviceConfig.ssl.cert }, serverKoa.callback())
      .on('connection', socket => socket.setTimeout(120))
      .listen(443, () => console.log(`☕%c ${serviceConfig.name} listening on port 443`, consoleLogStyle.green))
}
