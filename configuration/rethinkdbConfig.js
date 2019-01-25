import {DEPLOYMENT as development} from '../configuration/serverConfig.js'

let host = 'rethinkdb',
    port = 28015,
    database = 'webapp'

export default {
  development: {
    host,
    port,
    database
  },
  production: {
    host,
    port,
    database
  }
}[development];
