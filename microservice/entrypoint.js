
import { default as Application } from '../class/Application.class.js'
import initializeDatabaseData from 'appscript/utilityFunction/database/initializeDatabaseData.js'
import oAuthInitializePortServer from 'appscript/class/port/oAuth/initializePortServer.js'
import webappUIInitializePortServer from 'appscript/class/port/webappUI/initializePortServer.js'
import staticContentInitializePortServer from 'appscript/class/port/staticContent/initializePortServer.js'
import apiInitializePortServer from 'appscript/class/port/api/initializePortServer.js'
import websocketInitializePortServer from 'appscript/class/port/webSocket/initializePortServer.js'

async function microservice({
    configuration,
    entrypointConditionKey,
    databaseData
}) {
    Application.eventEmitter.on('initializationEnd', initializeDatabaseData({
        databaseVersion: configuration.databaseVersion,
        databaseData
    }))
    Application.eventEmitter.on('initializationEnd', oAuthInitializePortServer())
    Application.eventEmitter.on('initializationEnd', webappUIInitializePortServer())
    Application.eventEmitter.on('initializationEnd', staticContentInitializePortServer({ entrypointConditionKey}))
    Application.eventEmitter.on('initializationEnd', apiInitializePortServer())
    Application.eventEmitter.on('initializationEnd', websocketInitializePortServer())
    Application.initialize() // allows calling a child class from its parent class.
}

export { microservice as microservice }

// _____________________________________________

// TODO: change base url and access-control-allow-origin header according to DEPLOYMENT environment

// TODO: Custom Dataset Schema/structure/blueprint, data document, csustom dataset type, custom fields, custom content type.
// TODO: Condition Tree:
// • Ability to decide insertion position of unit in subtree. e.g. before, after, first, last.
// • Check non immediate children for each insertion point to insert them in their correct destination.
// • Define unique key for each child, to allow insertion into other inserted children. i.e. extending existing trees with other trees and children. 

// TODO: Merge ReusableNestedUnit implementations and organize them according to the requirements like returned value and algorithm executed on the nested tree.