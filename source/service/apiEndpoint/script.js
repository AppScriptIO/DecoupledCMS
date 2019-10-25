import { createHttpServer } from '../../utility/server.js'
import { graphMiddleware } from './middleware/graphMiddleware.js'
import serviceConfig from './configuration.js'

const port = 11

export async function initialize({ targetProjectConfig }) {
  let middlewareArray = [
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    await graphMiddleware({ targetProjectConfig }),
    async (context, next) => console.log('last middleware reached.'),
  ]

  // create http server
  await createHttpServer({ port, middlewareArray })
}
