import Koa from 'koa' // Koa applicaiton server
import http from 'http'
import implementConditionActionOnModuleUsingJson from '../../utility/middleware/implementConditionActionOnModuleUsingJson.js'
import implementMiddlewareOnModuleUsingJson from '../../utility/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'
import serviceConfig from './configuration.js'
import { Graph as GraphModule, Context as ContextModule, Database as DatabaseModule, modelAdapter, Entity } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
const { Database } = DatabaseModule
import * as graphData from './graphData.json'
import { bodyParserMiddleware } from '../../middleware/bodyParser.middleware.js'

async function initializeGraph({ targetProjectConfig, context }) {
  let contextInstance = new Context.clientInterface(Object.assign({ targetProjectConfig }, context))
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: modelAdapter.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  let configuredGraph = Graph.clientInterface({ parameter: [{ database: concreteDatabaseBehavior, concreteBehaviorList: [contextInstance] }] })
  let graph = new configuredGraph({})
  await graph.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  console.log(`• loaded service graph data.`)
  return graph
}

export async function initialize({ targetProjectConfig }) {
  let graph = await initializeGraph({
    targetProjectConfig,
    context: {
      functionContext: {
        bodyParser: bodyParserMiddleware,
      },
      conditionContext: {},
    },
  })

  // createKoaServer
  let serverKoa = new Koa() // export if script is required.
  serverKoa.subdomainOffset = 1 // for localhost domain.

  // applyKoaMiddleware
  let middlewareArray = [
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    async (context, next) => {
      // execution types: functionWrappedMiddleware,

      let result = await graph.traverse({ nodeKey: '05bd55ed-212c-4609-8caf-e464a7cceb74' })
      console.log(result)

      // await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)

      // let conditionController = await ConditionController.createContext()
      // let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' })
      // let isCalledNext = await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
      // if (!isCalledNext) await next()
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) =>
    http.createServer(serverKoa.callback()).listen(2, () => console.log(`☕%c ${serviceConfig.serviceName} listening on port ${2}`, consoleLogStyle.style.green) && resolve()),
  )
}
