// import { class as Application } from './class/Application.class.js'
// import initializeDatabaseData from './utilityFunction/database/initializeDatabaseData.js'
// import oAuthInitializePortServer from './class/port/oAuth/initializePortServer.js'
// import openIdConnectInitializePortServer from './class/port/openIdConnect/initializePortServer.js'
// import webappUIInitializePortServer from './class/port/webappUI/initializePortServer.js'
// import staticContentInitializePortServer from './class/port/staticContent/initializePortServer.js'
// import apiInitializePortServer from './class/port/api/initializePortServer.js'
// import websocketInitializePortServer from './class/port/webSocket/initializePortServer.js'

/**
 * - Connect to database
 * - Initialize database content
 * - create http server
 */
export async function microservice({ targetProjectConfig, entrypointConditionKey, databaseData }) {
  // await Application.eventEmitter.on('initializationEnd', async () => {
  //   await initializeDatabaseData({
  //     databaseVersion: targetProjectConfig.databaseVersion,
  //     databaseData,
  //   })()
  //   console.groupCollapsed('Port classes initialization:')
  // await oAuthInitializePortServer()()
  // await openIdConnectInitializePortServer()()
  // await webappUIInitializePortServer()()
  // await staticContentInitializePortServer({ entrypointConditionKey })()
  // await apiInitializePortServer()()
  // await websocketInitializePortServer()()
  //   console.groupEnd()
  // })
  // await Application.initialize({ targetProjectConfig }) // allows calling a child class from its parent class.
}
