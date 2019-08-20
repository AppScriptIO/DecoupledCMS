import path from 'path'
import _ from 'underscore'
import filesystem from 'fs'
import https from 'https'
import http from 'http'
import koaViews from 'koa-views'
import debugLogMiddleNestedUnitStructure from '../../../utilityFunction/debugLogMiddlewareNestedUnitStructure.js'
const { Issuer } = require('openid-client')

let MiddlewareController = createStaticInstanceClasses({ implementationType: 'Middleware', cacheName: true })
let ConditionController = createStaticInstanceClasses({ implementationType: 'Condition', cacheName: true })

;async () => {
  let entrypointConditionKey
  let port = 80
  let entrypointSetting = {
    defaultConditionTreeKey: 'default',
  }

  // createKoaServer
  let serverKoa = new Koa() // export if script is required.
  if (self.config.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost

  // create http server
  let createdHttpServer = http.createServer(serverKoa.callback()).listen(self.port, () => {
    console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
    // eventEmitter.emit('listening')
    // process.emit('listening')
    if (process.send !== undefined) {
      // if process is a forked child process.
      if (self.config.DEPLOYMENT == 'development') process.send({ message: 'Server listening' })
    }
  })
  // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
  // TODO: The below should work, but for some reason the paths stopped working 'no suck file', - relative paths don't work
  if (self.config.ssl) {
    let options = {
      key: filesystem.readFileSync(path.join(__dirname, '/sampleSSL/server.key')),
      cert: filesystem.readFileSync(path.join(__dirname, './sampleSSL/server.crt')),
    }
    createdHttpServer = https
      .createServer(options, serverKoa.callback())
      .on('connection', socket => {
        socket.setTimeout(120)
      })
      .listen(443, () => {
        console.log(`☕%c ${self.name} listening on port 443`, self.config.style.green)
      })
  }

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

  // applyKoaMiddleware
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
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
  await middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) => {
    let httpServer = http.createServer(serverKoa.callback())
    // self.httpServer.on('connection', (socket) => {
    //     console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
    //     socket.on('end', () => { console.info('SOCKET END: other end of the socket sends a FIN packet') })
    //     socket.on('timeout', () => { console.info('SOCKET TIMEOUT') })
    //     socket.on('error', (error) => { console.info('SOCKET ERROR: ' + JSON.stringify(error)) })
    //     socket.on('close', (had_error) => { console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error) })
    // })
    // self.httpServer.setTimeout(0, () => {
    //     console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!')
    // })
    httpServer.listen(self.port, () => {
      console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
      resolve()
    })
  })
}

async function handleTemplateDocument(documentKey) {
  let documentObject = await getTableDocument.instance['template_documentBackend'](self.rethinkdbConnection, documentKey)
  // context.instance.config.clientBasePath should be defined using useragentDetection module.
  // NOTE:  documentKey should be received from database and nested unit key retreived from there too.
  // document could have different rules for users etc.. access previlages
  let templateController = await new TemplateController(false, { portAppInstance: this.context.instance })
  let renderedContent = await templateController.initializeNestedUnit({ nestedUnitKey: documentObject.viewNestedUnit })
  this.context.body = renderedContent

  // // let argument = {
  // //     layoutElement: 'webapp-layout-list'
  // // }
  // // let mainDocumentElement = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.html`, 'utf-8')
  // // let mainDocumentElementImport = await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/document-element/document-element.import.html`, 'utf-8')

  // // Shared arguments between all templates being rendered
  // const templateArgument = {
  //   templateController,
  //   context: this.context,
  //   Application,
  //   argument: {},
  // }

  // const view = {
  //   metadata: _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/asset/metadata/metadata.html`, 'utf-8')),
  //   header: _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.js.html`, 'utf-8')),
  //   // body: _.template(mainDocumentElement, {Application, argument})
  // }
  // let template = _.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 'utf-8'))
  // this.context.body = template(Object.assign({}, templateArgument, { view, templateArgument }))

  // // Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
  // // await this.context.render(
  // //     `${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`,
  // //     Object.assign({}, templateArgument, { view, templateArgument })
  // // );
}
