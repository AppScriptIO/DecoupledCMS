import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import { default as Application } from '../../Application.class.js'
import OpenIdConnectClass from 'appscript/class/port/openIdConnect/OpenIdConnect.class.js'
import implementMiddlewareOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import implementConditionActionOnModuleUsingJson from 'appscript/utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import koaBodyParser from 'koa-bodyParser'
import koaMount from 'koa-mount' // mount koa app as middleware to another koa app
import koaViews from 'koa-views'
import { oidcInteractionEntrypoint, oidcInteractionLogin, oidcInteractionConfirm } from 'appscript/utilityFunction/middleware/oidcInteraction.middleware.js'
const { Issuer } = require('openid-client');

let MiddlewareController = createStaticInstanceClasses({
    Superclass: Application, 
    implementationType: 'Middleware',
    cacheName: true
})
let ConditionController = createStaticInstanceClasses({
    Superclass: Application, 
    implementationType: 'Condition',
    cacheName: true
})

export default ({} = {}) => async () => {
    let Class = OpenIdConnectClass
    /**
     * Ceates following routes: https://github.com/panva/node-oidc-provider/blob/master/lib/helpers/defaults.js#L210
     * add middlware to the oidc koa server array following instructions - https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#registering-module-middlewares-helmet-ip-filters-rate-limiters-etc
     */
    // Class.serverKoa.use()
    let middlewareArray = [
        koaViews('/', { map: { html: 'underscore', js: 'underscore' } } ), // add koa views for html rendering.
        koaMount( // mount oidc koa app as middlewares
            '/' /* base path to mount to */,
            Class.openIdConnectServer.app
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
        async (context, next) => {

            // should be on the client side
            // if(context.path == '/1'){

            //     const issuer = await Issuer.discover('http://localhost:8084')
    
            //     const client = new issuer.Client({
            //         client_id: 'privateClientApplication',
            //         client_secret: 'secret',
            //         id_token_signed_response_alg: 'RS256', // defaults to RS256
            //         token_endpoint_auth_method: 'client_secret_basic', // defaults to client_secret_basic
            //     }, /*[ keystore ]*/) // keystore is an optional argument for instantiating a client with configured asymmetrical ID Token or UserInfo response encryption
            //     let authURL = client.authorizationUrl({
            //         redirect_uri: 'https://lvh.me/cb',
            //         scope: 'openid',
            //     })
            //     console.log(authURL)
            //     client.introspect('token') // => Promise
            //     .then(function (response) {
            //         console.log(response);
            //     });
            // }



            console.log('Last Middleware reached.')
            await next()
        },
    ]
    Class.applyKoaMiddleware(middlewareArray)
    Class.createHttpServer()
}