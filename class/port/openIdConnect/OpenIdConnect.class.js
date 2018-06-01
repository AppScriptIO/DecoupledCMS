import { default as Application } from '../../Application.class.js'
import _ from 'underscore'
import filesystem from 'fs'
import https from 'https'
import http from 'http'
import { add, execute, applyMixin } from 'appscript/utilityFunction/decoratorUtility.js'
import { extendedSubclassPattern } from 'appscript/utilityFunction/extendedSubclassPattern.js';
import OpenIdConnectServer from 'oidc-provider'
import rethinkdbOIDCAdapter from './rethinkdbOIDCAdapter.js'
import memoryAdapter from 'oidc-provider/lib/adapters/memory_adapter.js' // for development only
import { oidcConfiguration, exampleConfiguration } from './oidcConfiguration.js'
import { clientArray } from './clientApplication.js'
import keystore from './key/keystore.json'

const self = 
@execute({ staticMethod: 'initializeStaticClass' })
@extendedSubclassPattern.Subclass()
class OpenIdConnect extends Application {
    
    static OpenIdConnectServer; // oidc-provider class
    static openIdConnectServer; // oidc-provider instance
    static serverKoa;
    static createdHttpServer;
    static port;
    static entrypointSetting = {
        defaultConditionTreeKey: ''
    }
    static middlewareArray = []
    middlewareArray = []
    next;

    static async initializeStaticClass(self) {
        super.initializeStaticClass()
        self.port = 8084

        /**
         * initialize oAuth2 server
         */
        self.OpenIdConnectServer = OpenIdConnectServer
        self.openIdConnectServer = new OpenIdConnectServer(
            `${Application.config.PROTOCOL}${Application.config.HOST}:${self.port}`, // issuer address
            exampleConfiguration // oidcConfiguration,            
        )
        await self.openIdConnectServer.initialize({ // initialize server.
            clients: clientArray,
            adapter: memoryAdapter, // databse adapter
            keystore, // encryption keys / certificates. TODO: create keystore for production
        })
        const oidcKoaServer = self.openIdConnectServer.app
        
        // cookie signing keys // TODO: add encryption keys for cookies to prevent tampering & add interval rotation for keys.
        // oidcKoaServer.keys = [/* Add signing keys for cookies & configure interval for creating new keys (rotation) */] // as explained in kos docs & in https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#cookieskeys
        
        // TODO: check if proxy configuration below is necessary for the production setup.
        // self.openIdConnectServer.proxy = true // trust x-forwarded headers, which are required for oidc to detect the original ip. // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#trusting-tls-offloading-proxies
        self.serverKoa.proxy = true
        
        /** state & nonce in openid connect server requests
         * In addition you need to create two random numbers for state and nonce. State is used to correlate the authentication response,
         * nonce is used to correlate the identity token coming back. Both values need to be stored temporarily (I use a cookie for that).
         * state parameter - returned from the response as it was sent in a parameter.
         * nonce claim - is integrated into the id_token in the response as a claim (token's data component).
         * IMPORTANT - the nonce for example in the cookie in the browser is saved as a cryptographic hash, and only the server can check wether the recieved nonce is able to verify and compare the nonces.
         */
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

}

export default self