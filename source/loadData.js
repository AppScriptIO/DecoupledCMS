import { connect } from 'utility/middleware/commonDatabaseFunctionality.js'

export async function loadData({ targetProjectConfig, databaseData }) {
  let rethinkdbConnection = await connect(rethinkdbConfig)
  await loadDatabaseData({ databaseData })
  await loadFrontendData({ targetConfig, rethinkdbConnection }) // initialize template document front end.
}

async function loadFrontendData({ targetConfig, rethinkdbConnection }) {
  let getTableDocument = { generate: getTableDocumentDefault, instance: [] }
  getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('webappSetting', 'template_documentFrontend')
  const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](targetConfig.rethinkdbConnection)
  let defaultLanguage = 'English'
  let uiContent = await queryPatternImplementation({
    databaseConnection: rethinkdbConnection,
    languageDocumentKey: defaultLanguage,
    dataTableName: 'ui',
  })
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
