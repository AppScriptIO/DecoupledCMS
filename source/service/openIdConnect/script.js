import filesystem from 'fs'
import koaBodyParser from 'koa-bodyParser'
import koaMount from 'koa-mount' // mount koa app as middleware to another koa app
import { oidcInteractionEntrypoint, oidcInteractionLogin, oidcInteractionConfirm } from '../../../utility/middleware/oidcInteraction.middleware.js'
import OpenIdConnectServer from 'oidc-provider'
import memoryAdapter from 'oidc-provider/lib/adapters/memory_adapter.js' // for development only
import { oidcConfiguration } from './oidcConfiguration.js'
import { clientArray } from './clientApplication.js'
import keystore from './key/keystore.json'
import { createTemplateRenderingMiddleware } from './middleware/templateRendering.js'

export async function initialize({ targetProjectConfig, entrypointKey }) {
  let OpenIdConnectServer // oidc-provider class
  let openIdConnectServer = new OpenIdConnectServer(
    `${PROTOCOL}${HOST}:${port}`, // issuer address
    oidcConfiguration,
  ) // oidc-provider instance

  let entrypointSetting = { defaultConditionTreeKey: '' }

  /**
   * initialize oAuth2 server
   */
  await openIdConnectServer
    .initialize({
      // initialize server.
      clients: clientArray,
      adapter: memoryAdapter, // databse adapter TODO: implement https://github.com/panva/node-oidc-provider/blob/master/example/my_adapter.js
      keystore, // encryption keys / certificates. TODO: create keystore for production
    })
    .catch(error => {
      throw error
    })
  const oidcKoaServer = openIdConnectServer.app

  // cookie signing keys // TODO: add encryption keys for cookies to prevent tampering & add interval rotation for keys.
  // oidcKoaServer.keys = [/* Add signing keys for cookies & configure interval for creating new keys (rotation) */] // as explained in kos docs & in https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#cookieskeys

  // TODO: check if proxy configuration below is necessary for the production setup.
  // openIdConnectServer.proxy = true // trust x-forwarded headers, which are required for oidc to detect the original ip. // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#trusting-tls-offloading-proxies
  serverKoa.proxy = true

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
    createTemplateRenderingMiddleware(),
    // mount oidc koa app as middlewares
    koaMount('/' /* base path to mount to */, openIdConnectServer.app),
    koaBodyParser(),
    async (context, next) => {
      // instance.middlewareArray.push(middleware)
      // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
      await context.set('Access-Control-Allow-Origin', '*')
      await context.set('connection', 'keep-alive')
      await next()
    },
    oidcInteractionEntrypoint({ openIdConnectServer: openIdConnectServer }),
    oidcInteractionLogin({ openIdConnectServer: openIdConnectServer }),
    oidcInteractionConfirm({ openIdConnectServer: openIdConnectServer }),
  ]
}
