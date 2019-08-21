import filesystem from 'fs'
import path from 'path'

export default {
  name: 'webappUserInterface',
  port: 80,
  ssl: {
    key: filesystem.readFileSync(path.join(__dirname, '../../../test/asset/sampleSSL/server.key')),
    cert: filesystem.readFileSync(path.join(__dirname, '../../../test/asset/sampleSSL/server.crt')),
  },
  rethinkdb: {
    host: 'rethinkdb',
    port: 28015,
    database: 'webapp',
  },
}
