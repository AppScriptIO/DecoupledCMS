// Static content server - could be upgraded to Content Delivery Network
import { createTemplateRenderingMiddleware } from './middleware/templateRendering.js'
import { graphMiddleware } from './middleware/graphMiddleware.js'

let port = 11

export async function initialize({ targetProjectConfig, entrypointKey, additionalData }) {
  let middlewareArray = [
    createTemplateRenderingMiddleware(),
    authorizationMiddleware(),
    await graphMiddleware({ targetProjectConfig, entrypointKey }),
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
      context.compress = true
    },
  ]

  // create http server
  await createServer({ port, middlewareArray })
}
