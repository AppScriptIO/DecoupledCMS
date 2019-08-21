// Authorization client example
const { Issuer } = require('openid-client')

const oidcPort = 8084
const issuer = await Issuer.discover(`http://localhost:${oidcPort}`)
const oidcClient = new issuer.Client(
  {
    client_id: 'privateClientApplication',
    client_secret: 'secret',
    id_token_signed_response_alg: 'RS256', // defaults to RS256
    token_endpoint_auth_method: 'client_secret_basic', // defaults to client_secret_basic
  } /*[ keystore ]*/,
) // keystore is an optional argument for instantiating a client with configured asymmetrical ID Token or UserInfo response encryption
let authURL = oidcClient.authorizationUrl({
  redirect_uri: 'https://lvh.me/cb',
  scope: 'openid',
})


async (context, next) => {
  if (context.path == '/oidcClient') {
    console.log(authURL)
    let introspection = await oidcClient
      .introspect('token') // => Promise
      .then(function(response) {
        return response
      })
    context.body = introspection
  }
  await next()
},
