"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.microservice = microservice;

var _ApplicationClass = _interopRequireDefault(require("../class/Application.class.js"));

var _initializeDatabaseData = _interopRequireDefault(require("../utilityFunction/database/initializeDatabaseData.js"));

var _initializePortServer = _interopRequireDefault(require("../class/port/openIdConnect/initializePortServer.js"));

var _initializePortServer2 = _interopRequireDefault(require("../class/port/webappUI/initializePortServer.js"));

var _initializePortServer3 = _interopRequireDefault(require("../class/port/staticContent/initializePortServer.js"));

var _initializePortServer4 = _interopRequireDefault(require("../class/port/api/initializePortServer.js"));

var _initializePortServer5 = _interopRequireDefault(require("../class/port/webSocket/initializePortServer.js"));

async function microservice({
  configuration,
  entrypointConditionKey,
  databaseData
}) {
  await _ApplicationClass.default.eventEmitter.on('initializationEnd', async () => {
    await (0, _initializeDatabaseData.default)({
      databaseVersion: configuration.databaseVersion,
      databaseData
    })();
    console.groupCollapsed('Port classes initialization:'); // await oAuthInitializePortServer()()

    await (0, _initializePortServer.default)()();
    await (0, _initializePortServer2.default)()();
    await (0, _initializePortServer3.default)({
      entrypointConditionKey
    })();
    await (0, _initializePortServer4.default)()();
    await (0, _initializePortServer5.default)()();
    console.groupEnd();
  });
  await _ApplicationClass.default.initialize(); // allows calling a child class from its parent class.
} // _____________________________________________
// TODO: change base url and access-control-allow-origin header according to DEPLOYMENT environment
// TODO: Custom Dataset Schema/structure/blueprint, data document, csustom dataset type, custom fields, custom content type.
// TODO: Condition Tree:
// • Ability to decide insertion position of unit in subtree. e.g. before, after, first, last.
// • Check non immediate children for each insertion point to insert them in their correct destination.
// • Define unique key for each child, to allow insertion into other inserted children. i.e. extending existing trees with other trees and children. 
// TODO: Merge ReusableNestedUnit implementations and organize them according to the requirements like returned value and algorithm executed on the nested tree.