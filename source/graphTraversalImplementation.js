import assert from 'assert'
import { graphScheme } from '@dependency/graphTraversal'

// a function that complies with graphTraversal processData implementation.
export const registerMiddlewareFunctionToServer = async ({ node, resource, graphInstance }) => {
  let functionContext = graphInstance.context.functionContext
  assert(functionContext, `• Context "functionContext" variable is required to reference functions from graph database strings.`)

  if (resource) {
    assert(resource.destination.labels.includes(graphScheme.nodeLabel.function), `• Unsupported Node type for resource connection.`)
    let functionName = resource.destination.properties.functionName || throw new Error(`• function resource must have a "functionName" - ${resource.destination.properties.functionName}`)
    let middlewareFunction = functionContext[functionName] || throw new Error(`• reference function name doesn't exist.`)
    try {
      return middlewareFunction
    } catch (error) {
      console.error(error) && process.exit()
    }
  }
}

export function functionWrappedMiddleware() {}
