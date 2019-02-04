import rethinkdbConfig from './rethinkdbConfig.js'
import serverConfig from './serverConfig.js'
import consoleLogStyleConfig from './consoleLogStyleConfig.js'
import appConfiguration from '../../../../../setup/configuration/configuration.js' // target project

export default Object.assign({}, rethinkdbConfig, serverConfig, consoleLogStyleConfig, appConfiguration);
