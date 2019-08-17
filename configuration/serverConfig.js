import path from 'path'

export function initialize({ targetProjectConfig }) {
  let serverBasePath = path.resolve(path.normalize(`${__dirname}/../../../`)),
  sourceCodePath = targetProjectConfig.directory.SourceCodePath,
  DEPLOYMENT = process.env.DEPLOYMENT || 'development',
  DISTRIBUTION = process.env.DISTRIBUTION || false,
  PORT = DEPLOYMENT == 'development' ? '9903' : process.env.PORT || 80,
  SSL = DEPLOYMENT == 'development' ? true : false,
  HOST = process.env.HOST || 'localhost',
  PROTOCOL = DEPLOYMENT == 'development' ? 'http://' : 'https://',
  SOCKET_PROTOCOL = DEPLOYMENT == 'development' ? 'ws://' : 'wss://'

  return {
    deployment: DEPLOYMENT,
    serverBasePath,
    sourceCodePath,
    directory: targetProjectConfig.directory,
    distributionPath: targetProjectConfig.directory.distributionPath,
    distribution: targetProjectConfig.distribution,
    port: PORT,
    ssl: SSL,
    DEPLOYMENT,
    DISTRIBUTION,
    HOST,
    PROTOCOL,
    SOCKET_PROTOCOL,
  }
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
