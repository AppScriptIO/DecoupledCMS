"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

const {
  createKeyStore
} = require('oidc-provider');

const keystore = createKeyStore();
Promise.all([keystore.generate('RSA', 2048), keystore.generate('EC', 'P-256'), keystore.generate('EC', 'P-384'), keystore.generate('EC', 'P-521')]).then(() => {
  console.log('• Generated key for OIDC provider token signature.');

  _fs.default.writeFileSync(_path.default.join(__dirname, '/key/keystore.json'), JSON.stringify(keystore.toJSON(true), null, 2));
});