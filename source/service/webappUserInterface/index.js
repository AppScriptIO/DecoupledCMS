import filesystem from 'fs'
import https from 'https'
import http from 'http'
import underscore from 'underscore'
import koaViews from 'koa-views'
import Koa from 'koa' // Koa applicaiton server
import serviceConfig from './configuration.js'
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'
import implementConditionActionOnModuleUsingJson from '../../utility/middleware/implementConditionActionOnModuleUsingJson.js'
import { Graph as GraphModule, Context as ContextModule, Database as DatabaseModule, modelAdapter } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
const { Database } = DatabaseModule
import * as graphData from '../../../resource/sequence.graphData.json'

async function initializeGraph({ targetProjectConfig, additionalData }) {
  let contextInstance = new Context.clientInterface({ targetProjectConfig })
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: modelAdapter.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  // let concereteDatabaseInstance = concreteDatabaseBehavior[Entity.reference.getInstanceOf](Database)
  // let concereteDatabase = concereteDatabaseInstance[Database.reference.key.getter]()
  let configuredGraph = Graph.clientInterface({ parameter: [{ database: concreteDatabaseBehavior, concreteBehaviorList: [contextInstance] }] })
  let graph = new configuredGraph({})
  await graph.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  console.log(`• loaded service graph data.`)
  if (additionalData) {
    await graph.database.loadGraphData({ nodeEntryData: additionalData.node, connectionEntryData: additionalData.edge })
    console.log(`• loaded additional graph data.`)
  }
  return graph
}

export async function initialize({ targetProjectConfig, entrypointKey = 'default', additionalData }) {
  let graph = await initializeGraph({ targetProjectConfig, additionalData })

  underscore.templateSettings = serviceConfig.underscore
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)

  let serverKoa = new Koa() // export if script is required.
  serverKoa.subdomainOffset = 1 // for localhost domain.

  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      await next()
    },
    async (context, next) => {
      if (context.header.debug == 'true') console.log(`• Entrypoint Key: ${entrypointKey} \n \n`)
      let callbackOption = await graph.traverse({ nodeKey: entrypointKey })

      if (context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callbackOption.name}`, consoleLogStyle.style.green)

      let composedMiddleware = await implementConditionActionOnModuleUsingJson({ setting: callbackOption })
      await composedMiddleware(context, next)
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

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
    .listen(1, () => {
      if (process.send !== undefined) process.send({ message: 'Server listening' }) // if process is a forked child process.
      process.emit('listening')
      console.log(`☕%c ${serviceConfig.serviceName} listening on port ${1}`, consoleLogStyle.style.green)
    })
}
