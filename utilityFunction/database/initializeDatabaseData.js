import { default as Application } from 'appscript'
import {default as getTableDocumentDefault} from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import { createDatabase, createTableAndInsertData, deleteAllDatabase } from "appscript/utilityFunction/database/initializeDatabase.query.js";
import databaseData from 'databaseDefaultData/databaseData.js'

function initializeDatabaseData({databaseVersion} = {}) {
    return async () => {
        const connection = Application.rethinkdbConnection
        console.log(`SZN Database version: ${databaseVersion}`)
        if(!databaseVersion) await deleteAllDatabase(connection).then(console.log('SZN Rethinkdb - All databases dropped.'))

        createDatabase('webappSetting', connection)
            .then(async () => {
                try {
                    await createTableAndInsertData('webappSetting', databaseData.webappSetting, connection)
                } catch (error) {
                    console.log('webappSetting - cannot create table / insert data for webappSetting')
                    console.log(error)
                    process.exit(1)
                }
            })
            .then(async () => { // initialize template document front end.
                const self = Application
                let getTableDocument = {
                    generate: getTableDocumentDefault,
                    instance: []
                }
                getTableDocument.instance['template_documentFrontend'] = await getTableDocument.generate('template_documentFrontend')
                const documentFrontendData = await getTableDocument.instance['template_documentFrontend'](self.rethinkdbConnection)
                self.frontend = { // Configurations passed to frontend 
                    config: self.config,
                    setting: {
                        location: {
                            routeBasePath: `${self.config.PROTOCOL}${self.config.HOST}`
                        }
                    },
                    route: 'route',
                    document: documentFrontendData,
                }    
            })

        createDatabase('webappContent', connection)
            .then(() => {
                try {
                    createTableAndInsertData('webappContent', databaseData.webappContent, connection)            
                } catch (error) {
                    console.log('webappContent - cannot create table / insert data for webappContent')
                    console.log(error)
                }
            })

    }
}

export default initializeDatabaseData