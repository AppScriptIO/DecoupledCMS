import rethinkDB from 'rethinkdb' 

export async function createDatabase(databaseName, connection) {
    let databaseExists = await rethinkDB.dbList().contains(databaseName).run(connection);
    if(!databaseExists) {
        let dbCreationResponse = await rethinkDB.dbCreate(databaseName).run(connection)
        
        // .do(function(databaseExists) {
        //   return rethinkDB.branch(
        //     databaseExists,
        //     { dbs_created: 0 },
        //     rethinkDB.dbCreate('webapp')
        //   );
        // })

        if(dbCreationResponse.dbs_created > 0)  console.log(`📢 ${databaseName} database created !`)
    } else {
        console.log(`📢📁 ${databaseName} database already exists !`)            
    }
}

export async function createTableAndInsertData(databaseName, databaseData, connection) {
    for (let tableData of databaseData) {
        await rethinkDB.db(databaseName).tableCreate(tableData.databaseTableName).run(connection)
            .then(async tableCreationResponse => {
                if(tableCreationResponse.tables_created > 0) console.log(`📢 ${tableData.databaseTableName} table created.`)
                await rethinkDB.db(databaseName).table(tableData.databaseTableName).insert(tableData.data).run(connection)
                    .then(response => {
                        console.log(`📢📥 ${response.inserted} documents inserted to ${tableData.databaseTableName}.`)
                    })
                    .catch(error => console.log(error))
            })
            .catch(error => console.log(`📢 ${tableData.databaseTableName} table already exists.`))
    }
}
