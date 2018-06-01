export const clientArray = [
    // private client app.
    // {
    //     client_id: 'privateClientApplication', // private - i.e. it's data isn't exposed to the user.
    //     client_secret: 'secret',
    //     grant_types: [
    //         'client_credentials',
    //         'authorization_code',
    //         'implicit',
    //         'refresh_token'
    //     ],
    //     response_types: [
    //         'code id_token token',
    //         'code id_token',
    //         'code token',
    //         'code',
    //         'id_token token',
    //         'id_token',
    //         'none',
    //     ],
    //     redirect_uris: ['https://lvh.me/cb'],
    //     token_endpoint_auth_method: 'none' // authorization method for requests, one of either - client_secret_post, client_secret_basic, client_secret_jwt, private_key_jwt, or none. default is "client_secret_basic" https://openid.net/specs/openid-connect-registration-1_0.html#ClientMetadata
    // },
    {
        client_id: 'foo',
        redirect_uris: ['https://example.com'],
        response_types: ['id_token token'],
        grant_types: ['implicit'],
        token_endpoint_auth_method: 'none',
    },
  
]
