import Koa from 'koa' // Koa applicaiton server
import http from 'http'
import consoleLogStyle from '../../utility/consoleLogStyleConfig.js'
import serviceConfig from './configuration.js'
import { initializeGraph } from './graphInitialization.js'

export async function initialize({ targetProjectConfig }) {
  // createKoaServer
  const serverKoa = new Koa() // export if script is required.
  const registerMiddleware = middleware => serverKoa.use(middleware)
  serverKoa.subdomainOffset = 1 // for localhost domain.

  let { createGraphMiddleware } = await initializeGraph({ targetProjectConfig })

  // applyKoaMiddleware
  ;[
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    createGraphMiddleware({ entrypointKey: '05bd55ed-212c-4609-8caf-e464a7cceb74' }),
    async (context, next) => console.log('last middleware reached.'),
  ].forEach(registerMiddleware)

  // createHttpServer
  await new Promise((resolve, reject) =>
    http.createServer(serverKoa.callback()).listen(2, () => console.log(`☕%c ${serviceConfig.serviceName} listening on port ${2}`, consoleLogStyle.style.green) && resolve()),
  )
}
