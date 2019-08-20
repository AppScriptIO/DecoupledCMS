import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import koaBodyParser from 'koa-bodyParser'
import koaMount from 'koa-mount' // mount koa app as middleware to another koa app
import koaViews from 'koa-views'
import { oidcInteractionEntrypoint, oidcInteractionLogin, oidcInteractionConfirm } from '../../../utilityFunction/middleware/oidcInteraction.middleware.js'

let MiddlewareController = createStaticInstanceClasses({ implementationType: 'Middleware', cacheName: true })
let ConditionController = createStaticInstanceClasses({ implementationType: 'Condition', cacheName: true })

export default ({} = {}) => async () => {

  import _ from 'underscore'
  import filesystem from 'fs'
  import https from 'https'
  import http from 'http'
  import OpenIdConnectServer from 'oidc-provider'
  import rethinkdbOIDCAdapter from './rethinkdbOIDCAdapter.js'
  import memoryAdapter from 'oidc-provider/lib/adapters/memory_adapter.js' // for development only
  import { oidcConfiguration } from './oidcConfiguration.js'
  import { clientArray } from './clientApplication.js'
  import keystore from './key/keystore.json'
  
  
  let OpenIdConnectServer // oidc-provider class
  let openIdConnectServer // oidc-provider instance
    let port = 8084
  let entrypointSetting = {        defaultConditionTreeKey: '',      }
  
  /**
   * initialize oAuth2 server
   */
  self.OpenIdConnectServer = OpenIdConnectServer
  self.openIdConnectServer = new OpenIdConnectServer(
    `${Application.config.PROTOCOL}${Application.config.HOST}:${self.port}`, // issuer address
    oidcConfiguration,
  )
  await self.openIdConnectServer
    .initialize({
      // initialize server.
      clients: clientArray,
      adapter: memoryAdapter, // databse adapter TODO: implement https://github.com/panva/node-oidc-provider/blob/master/example/my_adapter.js
      keystore, // encryption keys / certificates. TODO: create keystore for production
    })
    .catch(error => {
      throw error
    })
  const oidcKoaServer = self.openIdConnectServer.app
  
  // cookie signing keys // TODO: add encryption keys for cookies to prevent tampering & add interval rotation for keys.
  // oidcKoaServer.keys = [/* Add signing keys for cookies & configure interval for creating new keys (rotation) */] // as explained in kos docs & in https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#cookieskeys
  
  // TODO: check if proxy configuration below is necessary for the production setup.
  // self.openIdConnectServer.proxy = true // trust x-forwarded headers, which are required for oidc to detect the original ip. // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#trusting-tls-offloading-proxies
  self.serverKoa.proxy = true
  
  /** state & nonce in openid connect server requests
   * In addition you need to create two random numbers for state and nonce. State is used to correlate the authentication response,
   * nonce is used to correlate the identity token coming back. Both values need to be stored temporarily (I use a cookie for that).
   * state parameter - returned from the response as it was sent in a parameter.
   * nonce claim - is integrated into the id_token in the response as a claim (token's data component).
   * IMPORTANT - the nonce for example in the cookie in the browser is saved as a cryptographic hash, and only the server can check wether the recieved nonce is able to verify and compare the nonces.
   */
  

  /**
   * Ceates following routes: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L210
   * add middlware to the oidc koa server array following instructions - https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#registering-module-middlewares-helmet-ip-filters-rate-limiters-etc
   */
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }), // add koa views for html rendering.
    koaMount(
      // mount oidc koa app as middlewares
      '/' /* base path to mount to */,
      openIdConnectServer.app,
    ),
    koaBodyParser(),
    // async (context, next) => {
    //     // instance.middlewareArray.push(middleware)
    //     // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
    //     await context.set('Access-Control-Allow-Origin', '*')
    //     await context.set('connection', 'keep-alive')
    //     await next()
    // },
    oidcInteractionEntrypoint({ openIdConnectServer: openIdConnectServer }),
    oidcInteractionLogin({ openIdConnectServer: openIdConnectServer }),
    oidcInteractionConfirm({ openIdConnectServer: openIdConnectServer }),
  ]

  await middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) => {
    http.createServer(self.serverKoa.callback()).listen(self.port, () => {
      console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
      // eventEmitter.emit('listening')
      // process.emit('listening')
      if (process.send !== undefined) {
        // if process is a forked child process.
        if (self.config.DEPLOYMENT == 'development') process.send({ message: 'Server listening' })
      }
    })
    // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
  })
}
