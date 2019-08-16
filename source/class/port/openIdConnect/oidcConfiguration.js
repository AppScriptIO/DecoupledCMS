export const oidcConfiguration = {
  // adapter: rethinkdbOIDCAdapter
  features: {
    discovery: true, // Exposes /.well-known/webfinger and /.well-known/openid-configuration endpoints
    devInteractions: false, // dev only - creates interaction views for users. When turned off the custom provided interaction are used.
    encryption: true,
    revocation: true, // allows revocation of tokens.
    introspection: true, // Allows client to get information about a token meta information (e.g. token validity). https://tools.ietf.org/html/rfc7662
    claimsParameter: true, // Allow requesting specific claims for returned "userinfo" object & "id_token" object. https://openid.net/specs/openid-connect-core-1_0.html#ClaimsParameter
    clientCredentials: true, // Allow client_credentials grant
    encryption: true, // Enables clients to receive encrypted userinfo responses, encrypted ID Tokens and to send encrypted request parameters to authorization.
    alwaysIssueRefresh: false, // false i.e. issue refresh token only when offline_access scope is requested
    // Regarding requests - should be x-www-form-urlencoded by default.
    request: true, // allows the request to be sent as one parameter (signed &/or encrypted)  https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests
    requestUri: true, // allows passing request details by reference, rather than by value. https://openid.net/specs/openid-connect-core-1_0.html#JWTRequests
    oauthNativeApps: true, // Changes redirect_uris validations for clients with application_type native to those defined in OAuth 2.0 for Native Apps - https://tools.ietf.org/html/rfc8252.
    sessionManagement: true, // draft spec
    backchannelLogout: false,
    frontchannelLogout: false,
    registration: true, // dynamic client registration - https://openid.net/specs/openid-connect-registration-1_0.html
    registrationManagement: true, // https://tools.ietf.org/html/rfc7592
    pkce: true, // security challenge for authorization code flow https://tools.ietf.org/html/rfc7636#section-6.2
  },
  discovery: {
    // Exposes /.well-known/webfinger and /.well-known/openid-configuration endpoints
    claim_types_supported: ['normal', 'aggregated', 'distributed'], // If used must be reflected in "findById" -> 'claims' function - returns additional information for claims https://openid.net/specs/openid-connect-core-1_0.html#AggregatedDistributedClaims
  },
  routes: {
    // Discovery fixed routes -  Exposes /.well-known/webfinger and /.well-known/openid-configuration endpoints
    authorization: '/auth', // authorize
    certificates: '/certs',
    check_session: '/session/check',
    end_session: '/session/end',
    introspection: '/token/introspection',
    registration: '/reg',
    revocation: '/token/revocation',
    token: '/token',
    userinfo: '/me',
  },
  // unsupported: { /* signing algorithms */ }, // change signing algorithms
  scopes: ['openid', 'offline_access'],
  claims: {
    // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#configuring-available-claims
    scopeName: ['claim name', 'claim name2'],
    address: ['address'],
    email: ['email', 'email_verified'],
    phone: ['phone_number', 'phone_number_verified'],
    profile: ['birthdate', 'family_name', 'gender', 'given_name', 'locale', 'middle_name', 'name', 'nickname', 'picture', 'preferred_username', 'profile', 'updated_at', 'website', 'zoneinfo'],
  },

  // TODO: https://github.com/panva/node-oidc-provider/blob/master/example/account.js implementation
  async findById(context, id) {
    // Adapter for user / account id & claims https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#accounts
    return {
      // temporarly for develoopment - return request id directly.
      accountId: id,
      async claims(use, scope) {
        return {
          sub: id,
        }
      },
    }
  },
  interactionUrl: function interactionUrl(ctx, interaction) {
    // devInteractions must be turned off
    return `/interaction/${ctx.oidc.uuid}`
  },
  interactionCheck: async function interactionCheck(ctx) {
    // devInteractions must be turned off
    if (!ctx.oidc.session.sidFor(ctx.oidc.client.clientId)) {
      return {
        error: 'consent_required',
        error_description: 'client not authorized for End-User session yet',
        reason: 'client_not_authorized',
      }
    } else if (ctx.oidc.client.applicationType === 'native' && ctx.oidc.params.response_type !== 'none' && !ctx.oidc.result) {
      return {
        error: 'interaction_required',
        error_description: 'native clients require End-User interaction',
        reason: 'native_client_prompt',
      }
    }
    return false
  },
}
