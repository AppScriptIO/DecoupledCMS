import path from 'path'

export let 
    serverBasePath = process.env.NODE_PATH || path.resolve(path.normalize(`${__dirname}/..`)),
    clientBasePath = path.resolve(path.normalize(`${serverBasePath}/../clientSide`)),
    DEPLOYMENT = process.env.DEPLOYMENT || 'development',
    PORT = (DEPLOYMENT == 'development') ? '9903' : process.env.PORT || 80,
    SSL = (DEPLOYMENT == 'development') ? true : false,
    HOST = (DEPLOYMENT == 'development') ? 'localhost' : process.env.HOST,
    PROTOCOL = (DEPLOYMENT == 'development') ? 'http://' : 'https://',
    SOCKET_PROTOCOL = (DEPLOYMENT == 'development') ? 'ws://' : 'wss://';

export default { 
  deployment: DEPLOYMENT,
  serverBasePath,
  clientBasePath,
  port: PORT,
  ssl: SSL,
  DEPLOYMENT,
  HOST,
  PROTOCOL,
  SOCKET_PROTOCOL
 }

// export default {
//   development: {
//     deployment: DEPLOYMENT,
//     appRootPath: appRootPath,
//     uploadsPath: uploadsPath,
//     port: PORT,
//     ssl: SSL
//   },
//   production: {
//     deployment: DEPLOYMENT,
//     appRootPath: appRootPath,
//     uploadsPath: uploadsPath,
//     port: PORT,
//     ssl: SSL
//   }
// }[DEPLOYMENT];
