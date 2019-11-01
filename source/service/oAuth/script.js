import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import OAuth2Server from 'oauth2-server'
import oAuth2ServerModel from './oAuth2Server.model.js'

/**
Database setting: 
  implementationName: 'oAuth',
  dataArray: ['client', 'token', 'user']


Condition Graph: 
conditionCheck/getMethod.js == 'POST' --> callback: "{"name":"post","type":"consoleLogMessage"}"
    /token --> callback: "{"name":"token","type":"portClassMethodMiddleware"}"
    /authorize --> callback: "{"name":"authorize","type":"portClassMethodMiddleware"}"



*/

export const initialize = async () => {
  let entrypointSetting = { defaultConditionTreeKey: 'XYZ' }

  let Request = OAuth2Server.Request
  let Response = OAuth2Server.Response

  /**
   * initialize oAuth2 server
   */
  // for endpoint requests examples for each grant type made - see: https://aaronparecki.com/oauth-2-simplified/#other-app-types)
  // Regarding request - should be x-www-form-urlencoded
  let oAuth2Server // oauth2-server instance
  OAuth2Server = OAuth2Server
  oAuth2Server = new OAuth2Server({
    debug: true,
    // grants: ['authorization_code', 'client_credentials', 'password', 'refresh_token'] // Cannot seem to find this option in docs.
    // clientIdRegex: '^[A-Za-z0-9-_\^]{5,30}$', // client id should be compliant with the regex.
    // accessTokenLifetime: 60 * 60 * 24, // set the access token to last for 24 hours
    model: oAuth2ServerModel,
  })

  // Templating engine & associated extention.
  serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } }))
  let middlewareArray = [
    bodyParser(),
    async (context, next) => {
      // instance.middlewareArray.push(middleware)
      // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).
      await context.set('Access-Control-Allow-Origin', '*')
      await context.set('connection', 'keep-alive')
      await next()
    },
    async (context, next) => {
      let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
      let middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec' })
      await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)

      // context.instance.config.clientBasePath = await Application.config.clientBasePath
      // await next()
    },
    async (context, next) => {
      // CONDITION
      // [1] Create instances and check conditions. Get callback either a function or document
      // The instance responsible for rquests of specific port.
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })

      let entrypointConditionTree = '0681f25c-4c00-4295-b12a-6ab81a3cb440'
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree })
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, consoleLogStyle.style.green)
      // [2] Use callback
      await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)

      if (callback && callback.name == 'post') {
        // for testing purposes.
        let x = await Class.authenticate(context.request, context.response)
        if (x) await next()
      }
    },
    async (context, next) => {
      context.status = 404
      console.log('Last Middleware reached.')
      await next()
    },
  ]
}
