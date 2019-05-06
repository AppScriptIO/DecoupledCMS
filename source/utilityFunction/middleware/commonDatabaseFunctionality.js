"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleConnection = handleConnection;
exports.createDatabase = createDatabase;
exports.createTable = createTable;
exports.connect = connect;
exports.getSubdocument = getSubdocument;
exports.getConditionTreeEntrypoint = getConditionTreeEntrypoint;

var _rethinkdbConfig = _interopRequireDefault(require("../../../setup/configuration/rethinkdbConfig.js"));

var _rethinkdb = _interopRequireDefault(require("rethinkdb"));

var _underscore = _interopRequireDefault(require("underscore"));

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

function handleConnection() {
  return async (context, next) => {
    // context.rethinkdbConnection = await connect()
    // Application.rethinkdbConnection = await context.rethinkdbConnection
    context.rethinkdbConnection = _ApplicationClass.default.rethinkdbConnection;
    await next(); // Execute database-dependent middleware
    // context.rethinkdbConnection.close().then(() => { // Close connection
    //     console.log('SZN - Rethinkdb database - connection closed')
    // })
  };
}

function createDatabase() {
  return async (context, next) => {
    await _rethinkdb.default.dbList().contains(`${_rethinkdbConfig.default.database}`).do(databaseExists => {
      return _rethinkdb.default.branch(databaseExists, {
        dbs_created: 0
      }, _rethinkdb.default.dbCreate(`${_rethinkdbConfig.default.database}`));
    }).run(context.rethinkdbConnection).catch(error => {
      throw error;
    });
    await next();
  };
}

function createTable() {
  return async (context, next) => {
    let tableName = 'setting';
    await _rethinkdb.default.tableList().run(context.rethinkdbConnection).then(tableNames => {
      if (!_underscore.default.includes(tableNames, tableName)) {
        return _rethinkdb.default.tableCreate(tableName).run(context.rethinkdbConnection);
      } else {
        return;
      }
    }).catch(error => {
      throw error;
    });
    await next();
  };
}

async function connect() {
  let connection;

  try {
    connection = await _rethinkdb.default // Create connection
    .connect({
      host: _rethinkdbConfig.default.host,
      port: _rethinkdbConfig.default.port,
      db: _rethinkdbConfig.default.database
    });
  } catch (e) {
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 2000));
    console.info(`☕Connection failed to RethinkDB, retrying.`);
    connection = await connect();
    await new Promise((resolve, reject) => setTimeout(() => resolve(), 1000));
    return connection;
  }

  console.info(`☕Connected to RethinkDB.`);
  return connection;
}

function getSubdocument(context) {
  return _rethinkdb.default.db("webapp").table("setting").get("valueReturningFile")('valueReturningFile').filter(function (file) {
    return file("key").match("bc7a29ab-facc-4054-ae34-c1b853c31a10");
  }).run(context.rethinkdbConnection);
}

async function getConditionTreeEntrypoint(connection) {
  let result = _rethinkdb.default.db("webapp").table("setting").get("conditionTree")("conditionTree").filter(conditionTree => {
    return conditionTree("key").match("default");
  }).run(connection);

  return result;
}