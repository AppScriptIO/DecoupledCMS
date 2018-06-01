export const oidcConfiguration = {
    // adapter: rethinkdbOIDCAdapter
    features: { 
        devInteractions: true, // dev only - creates interaction views for users.
        discovery: {  // Exposes /.well-known/webfinger and /.well-known/openid-configuration endpoints 
            claim_types_supported: ['normal', 'aggregated', 'distributed'] // If used must be reflected in "findById" -> 'claims' function - returns additional information for claims https://openid.net/specs/openid-connect-core-1_0.html#AggregatedDistributedClaims
        },
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
        async findById(ctx, id) { // Adapter for account id & claims https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#accounts
            return { // temporarly for develoopment - return request id directly.
                accountId: id,
                async claims(use, scope) { return { sub: id }; },
            };
        },
        routes: {
            // Discovery fixed routes -  Exposes /.well-known/webfinger and /.well-known/openid-configuration endpoints 
            authorization: '/auth',
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
        scopes: [
            'openid', 
            'offline_access'
        ],



    }
}

export const exampleConfiguration = {
    features: {
        claimsParameter: true,
        clientCredentials: true,
        discovery: true,
        encryption: true,
        introspection: true,
        registration: true,
        request: true,
        requestUri: true,
        revocation: true,
        sessionManagement: true,
      },
    
}