import filesystem from 'fs'
import https from 'https'
import http from 'http'
import _ from 'underscore'
import views from 'koa-views'
import bodyParser from 'koa-bodyparser'
import OAuth2Server from 'oauth2-server'
import oAuth2ServerModel from './oAuth2Server.model.js'

let MiddlewareController = createStaticInstanceClasses({ Superclass: Application, implementationType: 'Middleware', cacheName: true })
let ConditionController = createStaticInstanceClasses({ Superclass: Application, implementationType: 'Condition', cacheName: true })

export const initialize = async () => {
  let Request = OAuth2Server.Request
  let Response = OAuth2Server.Response

  // for endpoint requests examples for each grant type made - see: https://aaronparecki.com/oauth-2-simplified/#other-app-types)
  // Regarding request - should be x-www-form-urlencoded
  let oAuth2Server // oauth2-server instance
  let entrypointSetting = { defaultConditionTreeKey: 'XYZ' }

  let port = 8088

  /**
   * initialize oAuth2 server
   */
  OAuth2Server = OAuth2Server
  oAuth2Server = new OAuth2Server({
    debug: true,
    // grants: ['authorization_code', 'client_credentials', 'password', 'refresh_token'] // Cannot seem to find this option in docs.
    // clientIdRegex: '^[A-Za-z0-9-_\^]{5,30}$', // client id should be compliant with the regex.
    // accessTokenLifetime: 60 * 60 * 24, // set the access token to last for 24 hours
    model: oAuth2ServerModel,
  })

  let Class = OAuthClass
  // Templating engine & associated extention.
  Class.serverKoa.use(views('/', { map: { html: 'underscore', js: 'underscore' } }))
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
      // let wait = ms => new Promise(resolve => setTimeout(resolve, ms));
      // await wait(500)
      let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
      let middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec' })
      await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)

      // context.instance.config.clientBasePath = await Application.config.clientBasePath
      // await next()
    },
    async (context, next) => {
      // CONDITION
      let self = Class
      // [1] Create instances and check conditions. Get callback either a function or document
      // The instance responsible for rquests of specific port.
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })

      let entrypointConditionTree = '0681f25c-4c00-4295-b12a-6ab81a3cb440'
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree })
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green)
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
      // console.log('Last Middleware reached.')
      await next()
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

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
}

/**
 * Authenticates a request, i.e. validates a token.
 * (See: https://tools.ietf.org/html/rfc6749#section-7)
 * @return {object} tokenData - access token object returned from Model#getAccessToken().
 */
function authenticateMiddleware() {
  return async (request, response) => {
    console.log('authenticate function')

    let options = {
      scope: undefined, // The scope(s) to authenticate
      addAcceptedScopesHeader: true, // Set the X-Accepted-OAuth-Scopes HTTP header on response objects.
      addAuthorizedScopesHeader: true, // Set the X-OAuth-Scopes HTTP header on response objects.
      allowBearerTokensInQueryString: false, // Allow clients to pass bearer tokens in the query string of a request
    }
    let oAuthRequest = new Request(request)
    let oAuthResponse = new Response(response)
    let tokenData = await self.oAuth2Server.authenticate(oAuthRequest, oAuthResponse, options).catch(error => {
      console.log(error)
    })
    return tokenData
  }
}

/**
 * Authorizes a token request. i.e. Authorize a client to request tokens.
 * The authorization endpoint is used to interact with the resource owner and obtain an authorization grant.
 * (See: https://tools.ietf.org/html/rfc6749#section-3.1)
 * @return {object} authorizationCode - authorization code object returned from Model#saveAuthorizationCode()
 * If request.query.allowed equals the string 'false' the access request is denied and the returned promise is rejected with an AccessDeniedError.
 */
async function authorize(request, response) {
  console.log('authorize function')

  let options = {
    authenticateHandler: {
      handle: data => {
        // Whatever you need to do to authorize / retrieve your user from post data here
        // check if the user that clicked authorize button is logged-in/authenticated.
        return { username: 'example' }
      },
    }, // {function} that gets the authenticated user. This option will allow to return user object.
    authorizationCodeLifetime: 300, // Lifetime of generated authorization codes in seconds (default = 300 seconds = 5 minutes)
    // allowEmptyState: false, // Allow clients to specify an empty state
  }
  let oAuthRequest = new Request(request)
  let oAuthResponse = new Response(response)
  let authorizationCode = await self.oAuth2Server.authorize(oAuthRequest, oAuthResponse, options).catch(error => {
    console.log(error)
  })
  return authorizationCode
}

/**
 * Retrieves a new token for an authorized token request. i.e. grant tokens to valid requests.
 * The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.
 * (See: https://tools.ietf.org/html/rfc6749#section-3.2)
 * @return
 */
async function token(request, response) {
  console.log('token function')
  let options = {
    accessTokenLifetime: 3600, // default 3,600 seconds (1 hour)
    refreshTokenLifetime: 1209600, // default 1,209,600 seconds (2 weeks)
    allowExtendedTokenAttributes: true, // Allow extended attributes to be set on the returned token. any additional properties set on the object returned from Model#saveToken() are copied to the token response sent to the client.
    alwaysIssueNewRefreshToken: false, // Always revoke the used refresh token and issue a new one for the refresh_token grant.
    requireClientAuthentication: {
      // By default all grant types require the client to send it’s client_secret with the token request
      password: false,
      authorization_code: true,
      client_credentials: true,
      refresh_token: false,
    },
    // extendedGrantTypes: {} // additional supported grant types. (see https://oauth2-server.readthedocs.io/en/latest/misc/extension-grants.html)
  }
  let oAuthRequest = new Request(request)
  let oAuthResponse = new Response(response)
  let tokenData = await self.oAuth2Server.token(oAuthRequest, oAuthResponse, options).catch(error => {
    console.log('token function:' + error)
  })
  return tokenData
}
