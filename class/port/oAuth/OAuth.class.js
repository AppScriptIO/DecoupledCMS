import { default as Application } from 'appscript'
import _ from 'underscore'
import filesystem from 'fs'
import https from 'https'
import http from 'http'
import OAuth2Server from 'oauth2-server'
import oAuth2ServerModel from './oAuth2Server.model.js'
let Request = OAuth2Server.Request;
let Response = OAuth2Server.Response;
import { add, execute, applyMixin } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js';

// for endpoint requests examples for each grant type made - see: https://aaronparecki.com/oauth-2-simplified/#other-app-types)
// Regarding request - should be x-www-form-urlencoded

const self = 
@execute({ staticMethod: 'initializeStaticClass' })
@extendedSubclassPattern.Subclass()
class OAuth extends Application {
    
    static OAuth2Server; // oauth2-server class
    static oAuth2Server; // oauth2-server instance
    static serverKoa;
    static createdHttpServer;
    static port;
    static entrypointSetting = {
        defaultConditionTreeKey: 'XYZ'
    }
    static middlewareArray = []
    middlewareArray = []
    next;

    static initializeStaticClass(self) {
        super.initializeStaticClass()
        self.port = 8088

        /**
         * initialize oAuth2 server
         */
        self.OAuth2Server = OAuth2Server
        self.oAuth2Server = new OAuth2Server({
            debug: true,
            // grants: ['authorization_code', 'client_credentials', 'password', 'refresh_token'] // Cannot seem to find this option in docs.
            // clientIdRegex: '^[A-Za-z0-9-_\^]{5,30}$', // client id should be compliant with the regex.
            // accessTokenLifetime: 60 * 60 * 24, // set the access token to last for 24 hours
            model: oAuth2ServerModel
        })
    
    }
    constructor(skipConstructor = false) {
        super(true)
        this.config = {} // populated by useragentDetection module.
        if(skipConstructor) return;
        // if (!new.target) console.log(new.target) // not supported by babel
        // if (!(this instanceof WebappUI)) return new WebappUI() // This is used in factory functions not classes.
    }

    static createHttpServer() {
        const self = this
        self.createdHttpServer = http.createServer(self.serverKoa.callback())
            .listen(self.port, ()=> {
                console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green)
                // eventEmitter.emit('listening')
                // process.emit('listening')
                if (process.send !== undefined) { // if process is a forked child process.
                    if(self.config.DEPLOYMENT == 'development') process.send({ message: 'Server listening'});
                }
            })
        // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
    }

    /**
     * Authenticates a request, i.e. validates a token.
     * (See: https://tools.ietf.org/html/rfc6749#section-7)
     * @return {object} tokenData - access token object returned from Model#getAccessToken().
     */
    static authenticateMiddleware() {
        return async (request, response) => {
            console.log('authenticate function')
            
            let options = {
                scope: undefined, // The scope(s) to authenticate
                addAcceptedScopesHeader: true, // Set the X-Accepted-OAuth-Scopes HTTP header on response objects.
                addAuthorizedScopesHeader: true, // Set the X-OAuth-Scopes HTTP header on response objects.
                allowBearerTokensInQueryString: false, // Allow clients to pass bearer tokens in the query string of a request
            }
            let oAuthRequest = new Request(request)
            let oAuthResponse = new Response(response)
            let tokenData = await self.oAuth2Server.authenticate(oAuthRequest, oAuthResponse, options)
                .catch((error) => {
                    console.log(error)
                })
            return tokenData
        }
    }

    /**
     * Authorizes a token request. i.e. Authorize a client to request tokens.
     * The authorization endpoint is used to interact with the resource owner and obtain an authorization grant.
     * (See: https://tools.ietf.org/html/rfc6749#section-3.1)
     * @return {object} authorizationCode - authorization code object returned from Model#saveAuthorizationCode()
     * If request.query.allowed equals the string 'false' the access request is denied and the returned promise is rejected with an AccessDeniedError.
     */
    async authorize(request, response) {
        console.log('authorize function')
        
        let options = {
            authenticateHandler: {
                handle: (data) => { // Whatever you need to do to authorize / retrieve your user from post data here
                    // check if the user that clicked authorize button is logged-in/authenticated.
                    return { username: 'example' };
                }
            }, // {function} that gets the authenticated user. This option will allow to return user object.
            authorizationCodeLifetime: 300, // Lifetime of generated authorization codes in seconds (default = 300 seconds = 5 minutes)
            // allowEmptyState: false, // Allow clients to specify an empty state
        }
        let oAuthRequest = new Request(request)
        let oAuthResponse = new Response(response)
        let authorizationCode = await self.oAuth2Server.authorize(oAuthRequest, oAuthResponse, options)
            .catch((error) => {
                console.log(error)
            })
        return authorizationCode
    }

    /**
     * Retrieves a new token for an authorized token request. i.e. grant tokens to valid requests.
     * The token endpoint is used by the client to obtain an access token by presenting its authorization grant or refresh token.
     * (See: https://tools.ietf.org/html/rfc6749#section-3.2)
     * @return 
     */
    async token(request, response) {
        console.log('token function')
        let options = {
            accessTokenLifetime: 3600, // default 3,600 seconds (1 hour)
            refreshTokenLifetime: 1209600, // default 1,209,600 seconds (2 weeks)
            allowExtendedTokenAttributes: true, // Allow extended attributes to be set on the returned token. any additional properties set on the object returned from Model#saveToken() are copied to the token response sent to the client.
            alwaysIssueNewRefreshToken: false, // Always revoke the used refresh token and issue a new one for the refresh_token grant.
            requireClientAuthentication: { // By default all grant types require the client to send it’s client_secret with the token request
                password: false,
                authorization_code: true,
                client_credentials: true,
                refresh_token: false
            },
            // extendedGrantTypes: {} // additional supported grant types. (see https://oauth2-server.readthedocs.io/en/latest/misc/extension-grants.html)
        }
        let oAuthRequest = new Request(request)
        let oAuthResponse = new Response(response)
        let tokenData = await self.oAuth2Server.token(oAuthRequest, oAuthResponse, options)
            .catch((error) => {
                console.log('token function:' + error)
            })
        return tokenData
    }

}

export default self