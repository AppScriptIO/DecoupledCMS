import http from 'http'
import assert from 'assert'
import path from 'path'
import filesystem from 'fs'
import EventEmitter from 'events'
import compose from 'koa-compose'
import underscore from 'underscore'
import { connect } from '../utilityFunction/middleware/commonDatabaseFunctionality.js'
import { getMergedMultipleDocumentOfSpecificLanguage as queryPatternImplementation } from '@dependency/databaseUtility/source/patternImplementation.js'
import { initialize as rethinkdbConfigFunction } from '../../configuration/rethinkdbConfig.js'
import { initialize as serverConfigFunction } from '../../configuration/serverConfig.js'
import consoleLogStyleConfig from '../../configuration/consoleLogStyleConfig.js'

/**
 * - Connect to database
 * - Initialize database content
 * - create http server
 */
export async function serviceAggregator({ targetProjectConfig, entrypointConditionKey, databaseData }) {
  let serverConfig = serverConfigFunction({ targetProjectConfig })
  Object.assign(Application.config, serverConfig, rethinkdbConfigFunction({ serverConfig }), { appConfiguration: targetProjectConfig }, consoleLogStyleConfig)
  // One-time initialization of Applicaiton Class.
  console.info(`☕%c Running Application as ${self.config.DEPLOYMENT} - '${self.config.PROTOCOL}${self.config.HOST}'`, self.config.style.green)
  assert.notStrictEqual(self.config.HOST, undefined)

  self.rethinkdbConnection = await connect()

  // TODO: Sync settings between multiple underscore installations or fix issue when multiple installations present.
  // Solution option - when underscore used outside appscript module, export it to get it's settings.
  // underscore template should have one single instance accross application - To affect changes of _ to the main app.
  let underscorePath = require.resolve('underscore')
  let appLevelUnderscorePath = path.resolve(__dirname, '../../../node_modules/underscore/underscore.js')
  if (filesystem.existsSync(appLevelUnderscorePath) && underscorePath !== appLevelUnderscorePath) {
    // case - multiple underscore installations present
    console.log(`• Underscore template - Found multiple underscore installations, Using appscript local underscore instance (module in lower hierarchy) i.e. ${underscorePath}.`)
    // self.underscore = require(appLevelUnderscorePath)
    // throw 'Found multiple underscore installations. This will prevent consistent settings between modules that use underscore for templating e.g. koa-view and local appscript underscore usage.'
  } else {
    // single either appscript module installation or applevel installation.
    console.log(`• Underscore template - Found a single installation of underscore, using ${underscorePath}.`)
    // self.underscore = require(underscorePath)
  }

  underscore.templateSettings = {
    // initial underscore template settings on first import gets applied on the rest.
    evaluate: /\{\%(.+?)\%\}/g,
    interpolate: /\{\%=(.+?)\%\}/g,
    escape: /\{\%-(.+?)\%\}/g,
  }
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)

  await self.loadFrontendData() // initialize template document front end.

  // if(staticSubclass) self.addStaticSubclassToClassArray(staticSubclass)
  console.log('• App up & running !')

  // -------------------------------------

  console.log('run services')
  await initializeDatabaseData({ databaseVersion: targetProjectConfig.databaseVersion, databaseData })()
  console.groupCollapsed('Port classes initialization:')
  await oAuthInitializePortServer()()
  await openIdConnectInitializePortServer()()
  await webappUIInitializePortServer()()
  await staticContentInitializePortServer({ entrypointConditionKey })()
  await apiInitializePortServer()()
  await websocketInitializePortServer()()
  console.groupEnd()
}

async function loadFrontendData() {
  let getTableDocument = { generate: getTableDocumentDefault, instance: [] }
  getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('webappSetting', 'template_documentFrontend')
  const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](self.rethinkdbConnection)
  let defaultLanguage = 'English'
  // let uiContent = await queryPatternImplementation({
  //     databaseConnection: Application.rethinkdbConnection,
  //     languageDocumentKey: defaultLanguage,
  //     dataTableName: 'ui'
  // })
  self.frontendStatic = {
    // Configurations passed to frontend
    config: self.config,
    setting: {
      location: {
        routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`,
        cdnBasePath: self.extendedSubclass.static['StaticContent'].url,
      },
      mode: {
        // version / mode of app
        language: defaultLanguage, // default language
      },
    },
    route: 'route',
    document: documentFrontendData,
    // uiContent: uiContent
  }
}
