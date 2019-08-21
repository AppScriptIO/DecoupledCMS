import path from 'path'
import filesystem from 'fs'
import https from 'https'
import http from 'http'
import underscore from 'underscore'
import koaViews from 'koa-views'
const { Issuer } = require('openid-client')
import Koa from 'koa' // Koa applicaiton server

export const initialize = async ({ targetConfig }) => {
  let entrypointConditionKey
  let port = 80
  let entrypointSetting = { defaultConditionTreeKey: 'default' }

  // createKoaServer
  let serverKoa = new Koa() // export if script is required.
  if (targetConfig.DEPLOYMENT == 'development') serverKoa.subdomainOffset = 1 // i.e. localhost

  // TODO: The below should work, but for some reason the paths stopped working 'no suck file', - relative paths don't work
  if (false && targetConfig.ssl) {
    let options = {
      key: filesystem.readFileSync(path.join(__dirname, '/sampleSSL/server.key')),
      cert: filesystem.readFileSync(path.join(__dirname, './sampleSSL/server.crt')),
    }
    let createdHttpsServer = https
      .createServer(options, serverKoa.callback())
      .on('connection', socket => socket.setTimeout(120))
      .listen(443, () => console.log(`☕%c ${targetConfig.name} listening on port 443`, targetConfig.style.green))
  }

  // Authorization
  // const oidcPort = 8084
  // const issuer = await Issuer.discover(`http://localhost:${oidcPort}`)
  // const oidcClient = new issuer.Client(
  //   {
  //     client_id: 'privateClientApplication',
  //     client_secret: 'secret',
  //     id_token_signed_response_alg: 'RS256', // defaults to RS256
  //     token_endpoint_auth_method: 'client_secret_basic', // defaults to client_secret_basic
  //   } /*[ keystore ]*/,
  // ) // keystore is an optional argument for instantiating a client with configured asymmetrical ID Token or UserInfo response encryption
  // let authURL = oidcClient.authorizationUrl({
  //   redirect_uri: 'https://lvh.me/cb',
  //   scope: 'openid',
  // })

  // applyKoaMiddleware
  let middlewareArray = [
    koaViews('/', { map: { html: 'underscore', js: 'underscore' } }),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      console.log('req - res')
      await next()
    },
    // async (context, next) => {
    //   // CONDITION
    //   let self = Class
    //   // [1] Create instances and check conditions. Get callback either a function or document
    //   // The instance responsible for rquests of specific port.
    //   let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
    //   let entrypointConditionTree = entrypointConditionKey || targetConfig.entrypointSetting.defaultConditionTreeKey
    //   if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`)
    //   let callbackOption = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree })
    //   // if(process.env.SZN_DEBUG == 'true') console.log(`🍊 Callback object: ${callback.name}`)
    //   // [2] Use callback
    //   if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callbackOption.name}`, targetConfig.style.green)
    //   await implementConditionActionOnModuleUsingJson({ setting: callbackOption })(context, next)
    // },
    // async (context, next) => {
    //   if (context.path == '/oidcClient') {
    //     console.log(authURL)
    //     let introspection = await oidcClient
    //       .introspect('token') // => Promise
    //       .then(function(response) {
    //         return response
    //       })
    //     context.body = introspection
    //   }
    //   await next()
    // },
    async (context, next) => {
      console.log('Last Middleware reached.')
      await next()
    },
  ]
  middlewareArray.forEach(middleware => serverKoa.use(middleware))

  // createHttpServer
  await new Promise((resolve, reject) => {
    let httpServer = http.createServer(serverKoa.callback())
    // httpServer.on('connection', (socket) => {
    //     console.info('SOCKET OPENED' + JSON.stringify(socket.address()))
    //     socket.on('end', () => { console.info('SOCKET END: other end of the socket sends a FIN packet') })
    //     socket.on('timeout', () => { console.info('SOCKET TIMEOUT') })
    //     socket.on('error', (error) => { console.info('SOCKET ERROR: ' + JSON.stringify(error)) })
    //     socket.on('close', (had_error) => { console.info('SOCKET CLOSED. Is ERROR ?: ' + had_error) })
    // })
    // httpServer.setTimeout(0, () => console.log('HTTP server connection socket was timedout (console.log in httpServer.setTimeout)!'))
    let createdHttpServer = httpServer.listen(targetConfig.port, () => {
      if (process.send !== undefined) if (targetConfig.DEPLOYMENT == 'development') process.send({ message: 'Server listening' }) // if process is a forked child process.
      // eventEmitter.emit('listening')
      // process.emit('listening')

      console.log(`☕%c ${targetConfig.name} listening on port ${targetConfig.port}`, targetConfig.style.green)
      resolve()
    })
  })
}

async function handleTemplateDocument(documentKey) {
  let documentObject = await getTableDocument.instance['template_documentBackend'](targetConfig.rethinkdbConnection, documentKey)
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
  //   metadata: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/asset/metadata/metadata.html`, 'utf-8')),
  //   header: underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.js.html`, 'utf-8')),
  //   // body: underscore.template(mainDocumentElement, {Application, argument})
  // }
  // let template = underscore.template(await filesystem.readFileSync(`${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`, 'utf-8'))
  // this.context.body = template(Object.assign({}, templateArgument, { view, templateArgument }))

  // // Using 'context.render' using koa-views that uses consolidate.js as an underlying module.
  // // await this.context.render(
  // //     `${this.context.instance.config.clientBasePath}/template/root/entrypoint.html`,
  // //     Object.assign({}, templateArgument, { view, templateArgument })
  // // );
}
