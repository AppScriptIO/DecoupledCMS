"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));

var _http = _interopRequireDefault(require("http"));

var _decoratorUtility = require("@dependency/commonPattern/source/decoratorUtility.js");

var _extendedSubclassPattern = require("@dependency/commonPattern/source/extendedSubclassPattern.js");

var _oidcProvider = _interopRequireDefault(require("oidc-provider"));

var _memory_adapter = _interopRequireDefault(require("oidc-provider/lib/adapters/memory_adapter.js"));

var _oidcConfiguration = require("./oidcConfiguration.js");

var _clientApplication = require("./clientApplication.js");

var _keystore = _interopRequireDefault(require("./key/keystore.json"));

var _dec, _dec2, _class, _class2, _temp;

const self = (_dec = (0, _decoratorUtility.execute)({
  staticMethod: 'initializeStaticClass'
}), _dec2 = _extendedSubclassPattern.extendedSubclassPattern.Subclass(), _dec(_class = _dec2(_class = (_temp = _class2 = class OpenIdConnect extends _ApplicationClass.default {
  // oidc-provider class
  // oidc-provider instance
  static async initializeStaticClass(self) {
    super.initializeStaticClass();
    self.port = 8084;
    /**
     * initialize oAuth2 server
     */

    self.OpenIdConnectServer = _oidcProvider.default;
    self.openIdConnectServer = new _oidcProvider.default(`${_ApplicationClass.default.config.PROTOCOL}${_ApplicationClass.default.config.HOST}:${self.port}`, // issuer address
    _oidcConfiguration.oidcConfiguration);
    await self.openIdConnectServer.initialize({
      // initialize server.
      clients: _clientApplication.clientArray,
      adapter: _memory_adapter.default,
      // databse adapter TODO: implement https://github.com/panva/node-oidc-provider/blob/master/example/my_adapter.js
      keystore: _keystore.default // encryption keys / certificates. TODO: create keystore for production

    }).catch(error => {
      throw error;
    });
    const oidcKoaServer = self.openIdConnectServer.app; // cookie signing keys // TODO: add encryption keys for cookies to prevent tampering & add interval rotation for keys.
    // oidcKoaServer.keys = [/* Add signing keys for cookies & configure interval for creating new keys (rotation) */] // as explained in kos docs & in https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#cookieskeys
    // TODO: check if proxy configuration below is necessary for the production setup.
    // self.openIdConnectServer.proxy = true // trust x-forwarded headers, which are required for oidc to detect the original ip. // https://github.com/panva/node-oidc-provider/blob/master/docs/configuration.md#trusting-tls-offloading-proxies

    self.serverKoa.proxy = true;
    /** state & nonce in openid connect server requests
     * In addition you need to create two random numbers for state and nonce. State is used to correlate the authentication response,
     * nonce is used to correlate the identity token coming back. Both values need to be stored temporarily (I use a cookie for that).
     * state parameter - returned from the response as it was sent in a parameter.
     * nonce claim - is integrated into the id_token in the response as a claim (token's data component).
     * IMPORTANT - the nonce for example in the cookie in the browser is saved as a cryptographic hash, and only the server can check wether the recieved nonce is able to verify and compare the nonces.
     */
  }

  constructor(skipConstructor = false) {
    super(true);
    this.middlewareArray = [];
    this.config = {}; // populated by useragentDetection module.

    if (skipConstructor) return; // if (!new.target) console.log(new.target) // not supported by babel
    // if (!(this instanceof WebappUI)) return new WebappUI() // This is used in factory functions not classes.
  }

  static createHttpServer() {
    const self = this;
    self.createdHttpServer = _http.default.createServer(self.serverKoa.callback()).listen(self.port, () => {
      console.log(`☕%c ${self.name} listening on port ${self.port}`, self.config.style.green); // eventEmitter.emit('listening')
      // process.emit('listening')

      if (process.send !== undefined) {
        // if process is a forked child process.
        if (self.config.DEPLOYMENT == 'development') process.send({
          message: 'Server listening'
        });
      }
    }); // eventEmitter.on("listening", function () { console.log("catched listening on same script file"); })
  }

}, _class2.entrypointSetting = {
  defaultConditionTreeKey: ''
}, _class2.middlewareArray = [], _temp)) || _class) || _class);
var _default = self;
exports.default = _default;