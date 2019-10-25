export function initialize({ targetProjectConfig }) {
  let DEPLOYMENT = process.env.DEPLOYMENT || 'development'

  return {
    port: DEPLOYMENT == 'development' ? '9903' : process.env.PORT || 80,
    ssl: DEPLOYMENT == 'development' ? true : false,
    DISTRIBUTION: process.env.DISTRIBUTION || false,
    HOST: process.env.HOST || 'localhost',
    PROTOCOL: DEPLOYMENT == 'development' ? 'http://' : 'https://',
    SOCKET_PROTOCOL: DEPLOYMENT == 'development' ? 'ws://' : 'wss://',
    rethinkdb: {
      host: 'rethinkdb',
      port: 28015,
      database: 'webapp',
    },
  }
}
