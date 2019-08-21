export function initialize({ targetProjectConfig }) {
  let serverBasePath = targetProjectConfig.directory.distribution,
    sourceCodePath = targetProjectConfig.directory.source,
    DEPLOYMENT = process.env.DEPLOYMENT || 'development'

  return {
    deployment: DEPLOYMENT,
    serverBasePath,
    sourceCodePath,
    directory: targetProjectConfig.directory,
    distributionPath: targetProjectConfig.directory.distributionPath,
    distribution: targetProjectConfig.distribution,
    port: DEPLOYMENT == 'development' ? '9903' : process.env.PORT || 80,
    ssl: DEPLOYMENT == 'development' ? true : false,
    DISTRIBUTION: process.env.DISTRIBUTION || false,
    HOST: process.env.HOST || 'localhost',
    PROTOCOL: DEPLOYMENT == 'development' ? 'http://' : 'https://',
    SOCKET_PROTOCOL: DEPLOYMENT == 'development' ? 'ws://' : 'wss://',
  }
}
