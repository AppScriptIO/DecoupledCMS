import rethinkdbConfig from '../configuration/rethinkdbConfig.js'
import serverConfig from '../configuration/serverConfig.js'
import consoleLogStyleConfig from '../configuration/consoleLogStyleConfig.js'

export default Object.assign({}, rethinkdbConfig, serverConfig, consoleLogStyleConfig);
