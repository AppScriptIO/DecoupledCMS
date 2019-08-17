export function initialize({ serverConfig }) {

  let development = serverConfig.DEPLOYMENT

  let host = 'rethinkdb',
  port = 28015,
  database = 'webapp'

return {
  development: {
    host,
    port,
    database,
  },
  production: {
    host,
    port,
    database,
  },
}[development]

}
