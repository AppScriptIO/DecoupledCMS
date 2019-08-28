import { Graph as GraphModule, Context as ContextModule, Database as DatabaseModule, modelAdapter, Entity } from '@dependency/graphTraversal'
const { Graph } = GraphModule
const { Context } = ContextModule
const { Database } = DatabaseModule
import * as graphData from './graphData.json'
import { bodyParserMiddleware } from '../../middleware/bodyParser.middleware.js'
import composeMiddleware from 'koa-compose'
import { registerMiddlewareFunctionToServer, functionWrappedMiddleware } from '../../graphTraversalImplementation.js'

const debugGraphMiddleware = targetMiddleware =>
  new Proxy(targetMiddleware, {
    apply: function(target, thisArg, argumentsList) {
      console.log(target.name, ' middleware executing.')
      return Reflect.apply(...arguments)
    },
  })

// context that will be used by the graph traversal during execution.
const functionContext = {
    bodyParser: bodyParserMiddleware |> debugGraphMiddleware,
  },
  conditionContext = {}

export async function initializeGraph({ targetProjectConfig }) {
  let contextInstance = new Context.clientInterface({ targetProjectConfig, functionContext, conditionContext })
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: modelAdapter.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  let configuredGraph = Graph.clientInterface({ parameter: [{ database: concreteDatabaseBehavior, concreteBehaviorList: [contextInstance] }] })
  let graph = new configuredGraph({})
  //! DEBUG: commented out for debugging purposes
  // await graph.database.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  console.log(`• loaded service graph data.`)

  // add specific graph dependent implementations
  graph.traversal.processData['registerMiddleware'] = registerMiddlewareFunctionToServer
  graph.traversal.processData['functionWrappedMiddleware'] = functionWrappedMiddleware
  return { graph, createGraphMiddleware: createGraphMiddlewareFunction(graph) }
}

const createGraphMiddlewareFunction = graphInstance => ({ entrypointKey }) => async (context, next) => {
  let composedMiddleware = (await graphInstance.traverse({ nodeKey: entrypointKey })) |> (middlewareArray => composeMiddleware(middlewareArray))
  await composedMiddleware(context, next)

  // let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' })
  // let isCalledNext = await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
  // if (!isCalledNext) await next()
}
