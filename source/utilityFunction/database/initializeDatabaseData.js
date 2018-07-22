import { default as Application } from '../../class/Application.class.js'
import {default as getTableDocumentDefault} from "appscript/utilityFunction/database/query/getTableDocument.query.js";
import { createDatabase, createTableAndInsertData, deleteAllDatabase } from "appscript/utilityFunction/database/initializeDatabase.query.js";

function initializeDatabaseData({databaseVersion, databaseData} = {}) {
    return async () => {
        const connection = Application.rethinkdbConnection
        console.groupCollapsed('Database data insertion:')
        console.log(`SZN Database version: ${databaseVersion}`)
        if(!databaseVersion) await deleteAllDatabase(connection).then(console.log('SZN Rethinkdb - All databases dropped.'))

        await createDatabase('webappSetting', connection)
            .then(async () => {
                try {
                    await createTableAndInsertData('webappSetting', databaseData.webappSetting, connection)
                } catch (error) {
                    console.log('webappSetting - cannot create table / insert data for webappSetting')
                    console.log(error)
                    process.exit(1)
                }
            })

        await createDatabase('webappContent', connection)
            .then(async () => {
                try {
                    await createTableAndInsertData('webappContent', databaseData.webappContent, connection)            
                } catch (error) {
                    console.log('webappContent - cannot create table / insert data for webappContent')
                    console.log(error)
                }
            })
        console.groupEnd()
    }
}

export default initializeDatabaseData