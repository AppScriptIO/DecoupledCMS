import {
  Graph as GraphModule,
  Context as ContextModule,
  Database as DatabaseModule,
  GraphTraversal as GraphTraversalModule,
  modelAdapter,
  Entity,
  defaultImplementationList,
} from '@dependency/graphTraversal'
const { Graph } = GraphModule,
  { Context } = ContextModule,
  { Database } = DatabaseModule,
  { GraphTraversal } = GraphTraversalModule
import * as graphData from './graphData.json'
import { bodyParserMiddleware } from '../../middleware/bodyParser.middleware.js'
import composeMiddleware from 'koa-compose'
import { immediatelyExecuteMiddleware, returnMiddlewareFunction } from '../../graphTraversalImplementation.js'

const debugGraphMiddleware = targetMiddleware =>
  new Proxy(targetMiddleware, {
    apply: function(target, thisArg, argumentsList) {
      console.log(target.name, ' middleware executing.')
      return Reflect.apply(...arguments)
    },
  })

// TODO: add other stages to the graph with evaluations
// let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' })
// let isCalledNext = await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
// if (!isCalledNext) await next()

// context that will be used by the graph traversal during execution.
const functionContext = {
    bodyParser: bodyParserMiddleware |> debugGraphMiddleware,
  },
  conditionContext = {}

export async function initializeGraph({ targetProjectConfig }) {
  // context
  let contextInstance = new Context.clientInterface({ targetProjectConfig, functionContext, conditionContext })
  // database
  let concreteDatabaseBehavior = new Database.clientInterface({
    implementationList: { boltCypherModelAdapter: modelAdapter.boltCypherModelAdapterFunction({ url: { protocol: 'bolt', hostname: 'localhost', port: 7687 } }) },
    defaultImplementation: 'boltCypherModelAdapter',
  })
  let concereteDatabaseInstance = concreteDatabaseBehavior[Entity.reference.getInstanceOf](Database)
  let concereteDatabase = concereteDatabaseInstance[Database.reference.key.getter]()
  //! /////////////////////////////////////////////! DEBUG: commented out for debugging purposes
  // await concereteDatabase.loadGraphData({ nodeEntryData: graphData.node, connectionEntryData: graphData.edge })
  console.log(`• loaded service graph data.`)
  // traversal implementation
  let implementationList =
    defaultImplementationList
    |> (list => {
      // add specific graph dependent implementations
      list.processData['immediatelyExecuteMiddleware'] = immediatelyExecuteMiddleware
      list.processData['returnMiddlewareFunction'] = returnMiddlewareFunction
      return list
    })
  let concreteGraphTraversalBehavior = new GraphTraversal.clientInterface({
    implementationList: { middlewareGraph: implementationList },
    defaultImplementation: 'middlewareGraph',
  })
  let configuredGraph = Graph.clientInterface({
    parameter: [
      {
        traversal: concreteGraphTraversalBehavior,
        database: concreteDatabaseBehavior,
        concreteBehaviorList: [contextInstance],
      },
    ],
  })

  return { createGraphMiddleware: createGraphMiddlewareFunction(configuredGraph), configuredGraph }
}

// Immediately executing middlewares in graph traversal.
const createGraphMiddlewareFunction = configuredGraph => ({ entrypointKey }) => async (context, next) => {
  let graph = new configuredGraph({ data: { middlewareParameter: { context, next } } })
  await graph.traverse({ nodeKey: entrypointKey }) // implementation key is derived from the graph nodes - usally 'immediatelyExecuteMiddleware'
}

// Aggregating middleware approach - return a middleware array, then use koa-compose to merge the middlewares and execute it.
const createGraphMiddlewareFunctionApproad2 = configuredGraph => ({ entrypointKey }) => async (context, next) => {
  let graph = new configuredGraph({})
  let middlewareArray = await graph.traverse({ nodeKey: entrypointKey, implementationKey: { processData: 'returnMiddlewareFunction' } })
  await composeMiddleware(middlewareArray)(context, next)
}
