import filesystem from 'fs'
import path from 'path'
const { createKeyStore } = require('oidc-provider')

const keystore = createKeyStore()

Promise.all([keystore.generate('RSA', 2048), keystore.generate('EC', 'P-256'), keystore.generate('EC', 'P-384'), keystore.generate('EC', 'P-521')]).then(() => {
  console.log('• Generated key for OIDC provider token signature.')
  filesystem.writeFileSync(path.join(__dirname, '/key/keystore.json'), JSON.stringify(keystore.toJSON(true), null, 2))
})
