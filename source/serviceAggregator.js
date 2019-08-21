import http from 'http'
import assert from 'assert'
import path from 'path'
import filesystem from 'fs'
import EventEmitter from 'events'
import compose from 'koa-compose'
import underscore from 'underscore'
import consoleLogStyle from './utility/consoleLogStyleConfig.js'
import { connect } from 'utility/middleware/commonDatabaseFunctionality.js'
import { initialize as serverConfigFunction } from '../configuration/serverConfig.js'
import { initialize as webappUserInterface } from './service/webappUserInterface'

/**
 * - Connect to database
 * - Initialize database content
 * - create http server
 */
export async function serviceAggregator({ targetProjectConfig, entrypointConditionKey, databaseData }) {
  let targetConfig = {}
  Object.assign(targetConfig, serverConfigFunction({ targetProjectConfig }), { appConfiguration: targetProjectConfig })

  // One-time initialization of Applicaiton Class.
  console.info(`☕%c Running Application as ${targetConfig.DEPLOYMENT} - '${targetConfig.PROTOCOL}${targetConfig.HOST}'`, consoleLogStyle.green)

  underscore.templateSettings = { evaluate: /\{\%(.+?)\%\}/g, interpolate: /\{\%=(.+?)\%\}/g, escape: /\{\%-(.+?)\%\}/g } // initial underscore template settings on first import gets applied on the rest.
  console.info(`• Underscore template setting set as ${underscore.templateSettings.evaluate} ${underscore.templateSettings.interpolate} ${underscore.templateSettings.escape}`)

  // let rethinkdbConnection = await connect(targetConfig)
  // await loadDatabaseData({ databaseData })
  // await loadFrontendData({ targetConfig }) // initialize template document front end.

  console.groupCollapsed('• Run services:')
  await webappUserInterface({ targetProjectConfig })
  // await oAuthInitializePortServer()()
  // await openIdConnectInitializePortServer()()
  // await staticContentInitializePortServer({ entrypointConditionKey })()
  // await apiInitializePortServer()()
  // await websocketInitializePortServer()()
  console.groupEnd()

  console.log('• App up & running !')
}

async function loadFrontendData({ targetConfig }) {
  let getTableDocument = { generate: getTableDocumentDefault, instance: [] }
  getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('webappSetting', 'template_documentFrontend')
  const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](targetConfig.rethinkdbConnection)
  let defaultLanguage = 'English'
  // let uiContent = await queryPatternImplementation({
  //     databaseConnection: Application.rethinkdbConnection,
  //     languageDocumentKey: defaultLanguage,
  //     dataTableName: 'ui'
  // })
  targetConfig.frontendStatic = {
    // Configurations passed to frontend
    config: targetConfig,
    setting: {
      location: {
        routeBasePath: `${targetConfig.PROTOCOL}${targetConfig.HOST}`,
        cdnBasePath: targetConfig.extendedSubclass.static['StaticContent'].url,
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
