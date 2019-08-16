import koaViews from 'koa-views'
import { default as Application } from '../../Application.class.js'
import WebappUIClass from './WebappUI.class.js'
import debugLogMiddleNestedUnitStructure from '../../../utilityFunction/debugLogMiddlewareNestedUnitStructure.js'
import createStaticInstanceClasses from '@dependency/graphTraversal'
import createClassInstancePerRequest from '../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import implementMiddlewareOnModuleUsingJson from '../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality
import implementConditionActionOnModuleUsingJson from '../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import languageContent from '../../../utilityFunction/middleware/languageContent.middleware.js'
const { Issuer } = require('openid-client')

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

export default ({ entrypointConditionKey } = {}) => async () => {
  const oidcPort = 8084
  const issuer = await Issuer.discover(`http://localhost:${oidcPort}`)
  const oidcClient = new issuer.Client(
    {
      client_id: 'privateClientApplication',
      client_secret: 'secret',
      id_token_signed_response_alg: 'RS256', // defaults to RS256
      token_endpoint_auth_method: 'client_secret_basic', // defaults to client_secret_basic
    } /*[ keystore ]*/,
  ) // keystore is an optional argument for instantiating a client with configured asymmetrical ID Token or UserInfo response encryption
  let authURL = oidcClient.authorizationUrl({
    redirect_uri: 'https://lvh.me/cb',
    scope: 'openid',
  })

  let Class = WebappUIClass
  // Templating engine & associated extention.
  // Class.serverKoa.use()
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
    createClassInstancePerRequest(Class),
    async (context, next) => {
      // debugLogMiddleNestedUnitStructure('91140de5-9ab6-43cd-91fd-9eae5843c74c')
      context.set('connection', 'keep-alive')
      await next()
    },
    async (context, next) => {
      // CONDITION
      let self = Class
      // [1] Create instances and check conditions. Get callback either a function or document
      // The instance responsible for rquests of specific port.
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
      let entrypointConditionTree = entrypointConditionKey || self.entrypointSetting.defaultConditionTreeKey
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
      let callbackOption = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree })
      // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
      // [2] Use callback
      if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callbackOption.name}`, self.config.style.green)
      await implementConditionActionOnModuleUsingJson({ setting: callbackOption })(context, next)
    },
    async (context, next) => {
      if (context.path == '/oidcClient') {
        console.log(authURL)
        let introspection = await oidcClient
          .introspect('token') // => Promise
          .then(function(response) {
            return response
          })
        context.body = introspection
      }
      await next()
    },
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
    },
  ]
  Class.applyKoaMiddleware(middlewareArray)
  Class.createHttpServer()
}
