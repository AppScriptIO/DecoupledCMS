import rethinkDB from 'rethinkdb'
import getTableDocumentAndFilter from '@dependency/databaseUtility/source/getTableDocumentAndFilter.query.js'

let getTableDocument = {
  generate: getTableDocumentAndFilter,
  instance: [],
}
getTableDocument.instance['oAuth_token'] = getTableDocument.generate('oAuth_token')
getTableDocument.instance['oAuth_client'] = getTableDocument.generate('oAuth_client')
getTableDocument.instance['oAuth_user'] = getTableDocument.generate('oAuth_user')

export default {
  // Model functions required by node-auth2-server See https://github.com/oauthjs/node-oauth2-server for specification

  /**
   * Not implemented, using default instead.
   */
  generateAccessToken: undefined,
  generateRefreshToken: undefined,
  generateAuthorizationCode: undefined,
  getUserFromClient: undefined,

  // /**
  //  * Invoked to generate a new access token.
  //  * @param {object} client The client the access token is generated for.
  //  * @param {object} user The user the access token is generated for.
  //  * @param {string} scope The scopes associated with the access token. can be null.
  //  * @return {string} accessToken - A String to be used as access token.
  //  */
  // generateAccessToken: async (client, user, scope) => {

  // },

  /**
   * Invoked to retrieve a user using a username/password combination.
   * @param {string} userId
   * @param {string} userPassword
   * @return {object} representing the user or falsy if no such user could be found.
   */
  getUser: async (userId, userPassword) => {
    console.log('getUser function')
    const connection = Application.rethinkdbConnection
    let dbFilterObject = { key: userId, password: userPassword }
    let user = await getTableDocument.instance['oAuth_user'](connection, dbFilterObject)

    return {
      username: user.key,
      password: user.password,
    }
  },

  /**
   * the node-oauth2-server use this method to get detail infomation of a registered client.
   * @param {String} clientId - the client id
   * @param {String} [clientSecret] - the client secret, used in the token granting phase to authenticate the oauth client
   * @return {Object} client - the client object, containing (at least) the following infomation, or null if the client is not a valid registered client or the client secret doesn't match the clientId:
   *         {String} client.id - the client id
   *         {Array<String>} grants - an array of grant types allowed for this client, allowed values are: authorization_code | client_credentials | password | refresh_token
   *         {Array<String>} redirectUris - an array of urls (of the client) that allowed for redirecting to by the oauth server
   *         {Number} [accessTokenLifetime=3600] - define the lifetime of an access token in seconds, default is 1 hour
   *         {Number} [refreshTokenLifetime=3600 * 24 * 14] - define the lifetime of an refresh token in seconds, default is 2 weeks
   */
  getClient: async (clientId, clientSecret) => {
    console.log('getClient function')

    const connection = Application.rethinkdbConnection
    let dbFilterObject = clientSecret ? { key: clientId, clientSecret: clientSecret } : { key: clientId }
    let client = await getTableDocument.instance['oAuth_client'](connection, dbFilterObject)
    if (!client) return null
    // return in required format.
    return {
      id: client.key,
      redirectUris: [client.redirectUri],
      grants: client.grantType,
      // Client-specific lifetime of generated refresh tokens in seconds.
      // accessTokenLifetime: client.accessTokenLifetime,
      // refreshTokenLifetime: client.refreshTokenLifetime
    }
  },

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   * @param {String} accessToken - The access token to retrieve.
   * @return {Object} token - An Object representing the access token and associated data. Containing at least the following information:
   *         {String} .accessToken - the access token string
   *         {Date}   .accessTokenExpiresAt - the exact time when the access token should expire
   *         {String} .scope - access scope of this access token
   *         {Object} .client - the oauth client
   *         {String} .client.id - string id of the oauth client
   *         {Object} .user - the user which this access token represents, this data structure of the user object is not part of the Model Specification, and what it should be is completely up to you. In this example, we use { username: 'someUserName' } where the 'username' field is used to uniquely identify an user in the user database.
   */
  getAccessToken: async accessToken => {
    console.log('getAccessToken function')

    const connection = Application.rethinkdbConnection
    let tokenData = await getTableDocument.instance['oAuth_token'](connection, { type: 'accessToken', token: accessToken })
    if (!tokenData) return null
    let client = await getTableDocument.instance['oAuth_client'](connection, { key: tokenData.clientId })
    let user = await getTableDocument.instance['oAuth_user'](connection, { key: tokenData.userId })
    // return in required format.
    return {
      accessToken: tokenData.token,
      accessTokenExpiresAt: tokenData.expiresAt,
      scope: tokenData.scope,
      client: Object.assign(client, { id: client.key }), // with 'id' property
      user: {
        username: user.key,
      },
    }
  },

  /**
   * the node-oauth2-server use this method to get detail information of a refresh token previously stored used OauthModel.prototype.saveToken.
   * <b>Note:</b>refresh token is used by the oauth client to request for a new access token, and it's actually not related to any access token in any way, so access tokens and refresh tokens should be stored and retrieved independent to each other.
   * @param {String} refreshToken - the refresh token string
   * @return {Object} token - the token object containing (at least) the following infomation, or null if the refresh token doesn't exist:
   *        {String} token.refreshToken - the refresh token string
   *        {Date} token.refreshTokenExpiresAt - the exact time when the refresh token should expire
   *        {String} scope - the access scope
   *        {Object} client - the client object
   *        {String} client.id - the id of the client
   *        {Object} user - the user object
   *        {String} user.username - identifier of the user
   */
  getRefreshToken: async refreshToken => {
    console.log('getRefreshToken function')

    const connection = Application.rethinkdbConnection
    let tokenData = await getTableDocument.instance['oAuth_token'](connection, { type: 'refreshToken', token: refreshToken })
    if (!tokenData) return null
    let client = await getTableDocument.instance['oAuth_client'](connection, { key: tokenData.clientId })
    let user = await getTableDocument.instance['oAuth_user'](connection, { key: tokenData.userId })
    // return in required format.
    return {
      refreshToken: tokenData.token,
      refreshTokenExpiresAt: tokenData.expiresAt,
      scope: tokenData.scope,
      client: Object.assign(client, { id: client.key }), // with 'id' property
      user: {
        username: user.key,
      }, // with 'username' property
    }
  },

  /**
   * the node-oauth2-server use this method to get detail information of a authorization code previously stored used OauthModel.prototype.saveAuthorizationCode.
   * @param {String} authorizationCode - the authorization code string
   * @return {Object} code - the code object containing the following information, or null if the authorization code doesn't exist
   *         {String} code - the authorization code string
   *         {Date} expiresAt - the exact time when the code should expire
   *         {String} redirectUri - the redirect_uri query parameter of the '/oauth/authorize' request, indicating where to redirect to with the code
   *         {String} scope - the authorization scope deciding the access scope of the access token requested by the oauth client using this code
   *         {Object} client - the client object
   *         {String} client.id - the client id
   *         {Object} user - the user object
   *         {String} user.username - the user identifier
   */
  getAuthorizationCode: async authorizationCode => {
    console.log('getAuthorizationCode function')

    const connection = Application.rethinkdbConnection
    let tokenData = await getTableDocument.instance['oAuth_token'](connection, { type: 'authorizationCode', token: authorizationCode })
    if (!tokenData) return null
    let client = await getTableDocument.instance['oAuth_client'](connection, { key: tokenData.clientId })
    let user = await getTableDocument.instance['oAuth_user'](connection, { key: tokenData.userId })
    // return in required format.
    return {
      code: tokenData.token,
      expiresAt: tokenData.expiresAt,
      redirectUri: tokenData.redirectUri,
      scope: tokenData.scope,
      client: Object.assign(client, { id: client.key }), // with 'id' property
      user: {
        username: user.key,
      },
    }
  },

  /**
   * the node-oauth2-server uses this method to save an access token and an refresh token(if refresh token enabled) during the token granting phase.
   * @param {Object} token - the token object
   * @param {String} token.accessToken - the access token string
   * @param {Date} token.accessTokenExpiresAt - @see OauthModel.prototype.getAccessToken
   * @param {String} token.refreshToken - the refresh token string
   * @param {Date} token.refreshTokenExpiresAt - @see OauthModel.prototype.getRefreshToken
   * @param {String} token.scope - the access scope
   * @param {Object} client - the client object - @see OauthModel.prototype.getClient
   *        {String} client.id - the client id
   * @param {Object} user - the user object @see OauthModel.prototype.getAccessToken
   * @return {Object} token - the token object saved, same as the parameter 'token'
   */
  saveToken: async (token, client, user) => {
    console.log('saveToken function')
    let userId = user.username

    // TODO: set expiration / TTL - https://groups.google.com/forum/#!topic/rethinkdb/tFSiG5Ex1KE for rethinkdb underdevelopment.
    const connection = Application.rethinkdbConnection
    let returnedValue = {
      scope: token.scope,
      client: client,
      user: user,
    }

    if (token.accessToken) {
      await rethinkDB
        .db('webappSetting')
        .table('oAuth_token')
        .insert({
          token: token.accessToken,
          expiresAt: token.accessTokenExpiresAt,
          scope: token.scope,
          clientId: client.id,
          type: 'accessToken',
          userId: userId,
        })
        .run(connection)
    }

    if (token.refreshToken) {
      await rethinkDB
        .db('webappSetting')
        .table('oAuth_token')
        .insert({
          token: token.refreshToken,
          expiresAt: token.refreshTokenExpiresAt,
          scope: token.scope,
          clientId: client.id,
          userId: userId,
          type: 'refreshToken',
        })
        .run(connection)
    }

    Object.assign(returnedValue, {
      // token to the returned object.
      refreshToken: token.refreshToken,
      refreshTokenExpiresAt: token.refreshTokenExpiresAt,
      accessToken: token.accessToken,
      accessTokenExpiresAt: token.accessTokenExpiresAt,
    })

    return returnedValue
  },

  /**
   * the node-oauth2-server uses this method to save an authorization code.
   * @param {Object} code - the authorization code object
   * @param {String} code.authorizationCode - the authorization code string
   * @param {Date} code.expiresAt - the time when the code should expire
   * @param {String} code.redirectUri - where to redirect to with the code
   * @param {String} [code.scope] - the authorized access scope
   * @param {Object} client - the client object
   * @param {String} client.id - the client id
   * @param {Object} user - the user object
   * @param {String} user.username - the user identifier
   * @return {Object} code - the code object saved
   */
  saveAuthorizationCode: async (code, client, user) => {
    console.log('saveAuthorizationCode function')

    let userId = user.username
    const connection = Application.rethinkdbConnection

    await rethinkDB
      .db('webappSetting')
      .table('oAuth_token')
      .insert({
        type: 'authorizationCode',
        token: code.authorizationCode,
        expiresAt: code.expiresAt,
        redirectUri: code.redirectUri,
        scope: code.scope,
        clientId: client.id,
        userId: userId,
      })
      .run(connection)

    return {
      authorizationCode: code.authorizationCode,
      expiresAt: code.expiresAt,
      redirectUri: code.redirectUri,
      scope: code.scope,
      client: client,
      user: user,
    }
  },

  /**
   * the node-oauth2-server uses this method to revoke a refresh token(remove it from the store).
   * Note: by default, the node-oauth2-server enable the option 'alwaysIssueNewRefreshToken', meaning that every time you use a refresh token to get a new access token, the refresh token itself will be revoked and a new one will be issued along with the access token (you can set the option through OAuth2Server.token(request, response, [options], [callback]) or KoaOAuthServer.token(options)).
   * If you always use the refresh token before it expires, then there will always be a valid refresh token in the store(unless you explictly revoke it). This makes it seem like refresh token never expires.
   * @param {Object} token - the token object
   * @param {String} token.refreshToken - the refresh token string
   * @param {Date} token.refreshTokenExpiresAt - the exact time when the refresh token should expire
   * @param {String} token.scope - the access scope
   * @param {Object} token.client - the client object
   * @param {String} token.client.id - the client id
   * @param {Object} token.user - the user object
   * @param {String} token.user.username - the user identifier
   * @return {Boolean} - true if the token was successfully revoked, false if the token cound not be found
   */
  revokeToken: async token => {
    console.log('revokeToken function')

    const connection = Application.rethinkdbConnection
    let filterObject = { token: token.refreshToken }
    let { deleted: deletionResult } = await rethinkDB
      .db('webappSetting')
      .table('oAuth_token')
      .filter(filterObject)
      .delete()
      .run(connection)
    return deletionResult ? true : false
  },

  /**
   * the node-oauth2-server uses this method to revoke a authorization code(mostly when it expires)
   * @param {Object} code - the authorization code object
   * @param {String} authorizationCode - the authorization code string
   * @param {Date} code.expiresAt -the time when the code should expire
   * @param {String} code.redirectUri - the redirect uri
   * @param {String} code.scope - the authorization scope
   * @param {Object} code.client - the client object
   * @param {String} code.client.id - the client id
   * @param {Object}  code.user - the user object
   * @param {String} code.user.username - the user identifier
   * @return {Boolean} - true if the code is revoked successfully,false if the could not be found
   */
  revokeAuthorizationCode: async code => {
    console.log('revokeAuthorizationCode function')

    const connection = Application.rethinkdbConnection
    let filterObject = { token: code.code }
    let { deleted: deletionResult } = await rethinkDB
      .db('webappSetting')
      .table('oAuth_token')
      .filter(filterObject)
      .delete()
      .run(connection)
    return deletionResult ? true : false
  },

  /**
   * the node-oauth2-server uses this method to determine what scopes should be granted to the client for accessing the user's data.
   * for example, the client requests the oauth server for an access token of the 'user_info:read,user_info_write' scope,
   * but the oauth server determine by this method that only the 'user_info:read' scope should be granted.
   * @param {Object} user - the user whose data the client wants to access
   * @param {String} user.username - the user identifier
   * @param {Object} client - the oauth client
   * @param {String} client.id - the client id
   * @param {String} scope - the scopes which the client requested for
   * @return {String} validScopes - the actual valid scopes for the client, null if no valid scopes for the client
   */
  validateScope: async (user, client, scope) => {
    console.log('validateScope function')
    if (!scope) return null
    const connection = Application.rethinkdbConnection
    let dbFilterObject = { key: client.id }
    client = await getTableDocument.instance['oAuth_client'](connection, dbFilterObject)
    if (!client || !client.scope) return null
    let validScopes = client.scope.split(',').map(s => s.trim())
    let scopes = scope
      .split(',')
      .map(s => s.trim())
      .filter(s => validScopes.indexOf(s) >= 0)
    return scope.length ? scopes.join(',') : null
  },

  /**
   * node-oauth2-server uses this method in authentication handler to verify whether an access token from a request is sufficient to the 'scope' declared for the requested resources
   * @param {Object} accessToken - the accessToken object
   * @param {String} accessToken.accessToken - the accessToken string
   * @param {Date} accessToken.accessTokenExpiresAt - the time when the token should expire
   * @param {String} accessToken.scope - the granted access scope of the token
   * @param {Object} accessToken.client - the client object
   * @param {String} accessToken.client.id - the client id
   * @param {Object} accessTokne.user - the user object
   * @param {String} accessToken.user.username - the user identifier
   * @param {String} scope - the scope declared for the resources
   * @return {Boolean} - true if the access token has sufficient access scopes for the resources
   */
  verifyScope: async (accessToken, scope) => {
    console.log('verifyScope function')

    //no scope declared for the resource, free to access
    if (!scope) return true
    if (!accessToken.scope) return false
    validScopes = scope.split(',').map(s => s.trim())
    scopes = accessToken.scope.split(',').map(s => s.trim())
    //check if at least one of the scopes granted to the access token are allowed to access the resource
    return scopes.some(s => validScopes.indexOf(s) >= 0)
  },
}
