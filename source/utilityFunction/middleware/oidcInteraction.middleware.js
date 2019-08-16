import querystring from 'querystring'

// Implement interaction for user consent - https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#interaction
// #provider.interactionDetails(req) - route: "/interaction/:grant"
// #provider.interactionFinished(req, res, results) - route: "/interaction/:grant"
export function oidcInteractionEntrypoint({
  // interaction entrypoint
  openIdConnectServer,
}) {
  return async (context, next) => {
    // redirect to a specific interaction (e.g. login, confirm, etc.) depending on the interactionDetails provided by the oidc checking of the /authorize request.
    const pathArray = context.path.split('/').filter(item => item)
    if (pathArray[0] == 'interaction' && !pathArray[2]) {
      // check interaction details and then redirect.
      const details = await openIdConnectServer.interactionDetails(context.req)
      const client = await openIdConnectServer.Client.find(details.params.client_id)
      if (details.interaction.error === 'login_required') {
        // provide/serve login html view
        await context.render(`${__dirname}/../htmlView/oidcInteractionLogin.html`, {
          client,
          details,
          title: 'Sign-in',
          debug: querystring.stringify(details.params, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
          interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
        })
      } else {
        // serve confirm html screen
        await context.render(`${__dirname}/../htmlView/oidcInteractionConfirm.html`, {
          client,
          details,
          title: 'confirm consent',
          debug: querystring.stringify(details.params, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
          interaction: querystring.stringify(details.interaction, ',<br/>', ' = ', {
            encodeURIComponent: value => value,
          }),
        })
      }
    } else {
      await next()
    }
  }
}

export function oidcInteractionLogin({ openIdConnectServer }) {
  return async (context, next) => {
    // after completing interaction return the results to finish the interaction, and then as a result /authorize is called again.
    const pathArray = context.path.split('/').filter(item => item)
    if (pathArray[0] == 'interaction' && pathArray[2] == 'login') {
      const username = context.request.body.login
      const password = context.request.body.password

      // check username and password & get user unique id // TODO: check credentials
      const accountId = username

      // results should be an object passed to openIdConnectServer.interactionFinished with some or all the following properties
      const result = {
        login: {
          // authentication/login prompt got resolved, omit if no authentication happened, i.e. the user cancelled
          account: accountId, // logged-in account id
          acr: 'urn:mace:incommon:iap:bronze', // acr value for the authentication
          amr: ['pwd'],
          remember: !!context.request.body.remember, // true if provider should use a persistent cookie rather than a session one
          ts: Math.floor(Date.now() / 1000), // unix timestamp of the authentication
        },
        //     consent: {
        //     // use the scope property if you wish to remove/add scopes from the request, otherwise don't
        //     // include it use when i.e. offline_access was not given, or user declined to provide address
        //     scope: 'space separated list of scopes',
        //     },

        //     // meta is a free object you may store alongside an authorization. It can be useful
        //     // during the interactionCheck to verify information on the ongoing session.
        //     meta: {
        //     // object structure up-to-you
        //     },

        //     ['custom prompt name resolved']: {},
        // }

        // // optionally, interactions can be primaturely exited with a an error by providing a result
        // // object as follow:
        // {
        //     // an error field used as error code indicating a failure during the interaction
        //     error: 'access_denied',

        //     // an optional description for this error
        //     error_description: 'Insufficient permissions: scope out of reach for this Account',
        // }

        consent: {}, // consent was given by the user to the client for this session
      }

      await openIdConnectServer.interactionFinished(context.req, context.res, result)
      await next()
    } else {
      await next()
    }
  }
}

export function oidcInteractionConfirm({
  // TODO: FIX not calling confirm consent !!
  openIdConnectServer,
}) {
  return async (context, next) => {
    // after completing interaction return the results to finish the interaction, and then as a result /authorize is called again.
    const pathArray = context.path.split('/').filter(item => item)
    if (pathArray[0] == 'interaction' && pathArray[2] == 'confirm') {
      console.log('confirm middleware called')
      const result = { consent: {} }
      await openIdConnectServer.interactionFinished(context.req, context.res, result)
      await next()
    } else {
      await next()
    }
  }
}
