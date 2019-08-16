import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import { default as Application } from '../../Application.class.js'
import OpenIdConnectClass from './OpenIdConnect.class.js'
import implementMiddlewareOnModuleUsingJson from '../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import implementConditionActionOnModuleUsingJson from '../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import createStaticInstanceClasses from '../../../module/reusableNestedUnit'
import createClassInstancePerRequest from '../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import koaBodyParser from 'koa-bodyParser'
import koaMount from 'koa-mount' // mount koa app as middleware to another koa app
import koaViews from 'koa-views'
import { oidcInteractionEntrypoint, oidcInteractionLogin, oidcInteractionConfirm } from '../../../utilityFunction/middleware/oidcInteraction.middleware.js'

let MiddlewareController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Middleware',
  cacheName: true,
})
let ConditionController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Condition',
  cacheName: true,
})

export default ({} = {}) => async () => {
  let Class = OpenIdConnectClass
  /**
   * Ceates following routes: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L210
   * add middlware to the oidc koa server array following instructions - https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#registering-module-middlewares-helmet-ip-filters-rate-limiters-etc
   */
  // Class.serverKoa.use()
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }), // add koa views for html rendering.
    koaMount(
      // mount oidc koa app as middlewares
      '/' /* base path to mount to */,
      Class.openIdConnectServer.app,
    ),
    createClassInstancePerRequest(Class),
    koaBodyParser(),
    // async (context, next) => {
    //     // instance.middlewareArray.push(middleware)
    //     // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
    //     await context.set('Access-Control-Allow-Origin', '*')
    //     await context.set('connection', 'keep-alive')
    //     await next()
    // },
    oidcInteractionEntrypoint({ openIdConnectServer: Class.openIdConnectServer }),
    oidcInteractionLogin({ openIdConnectServer: Class.openIdConnectServer }),
    oidcInteractionConfirm({ openIdConnectServer: Class.openIdConnectServer }),
  ]
  Class.applyKoaMiddleware(middlewareArray)
  Class.createHttpServer()
}
