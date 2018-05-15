import path from 'path'
const useragentParser = require('useragent') // https://www.npmjs.com/package/useragent
require('useragent/features');
import serverConfig from 'appscript/configuration/serverConfig.js'
import { default as Application } from '../../class/Application.class.js'

function isES5(agent) {
    switch (agent.family) {
        case 'Chrome':
            return agent.satisfies('<50.0.0') ? true : false;
        break;
        case 'Firefox': 
            return agent.satisfies('<45.0.0') ? true : false;
        case 'Opera': 
            return agent.satisfies('<37.0.0') ? true : false;
        case 'Edge': 
            return agent.satisfies('<14.0.0') ? true : false;
        case 'Safari': 
            return agent.satisfies('<10.0.0') ? true : false;
        case 'Safari': 
            return agent.satisfies('<10.0.0') ? true : false;
        case 'Other':
        default:
            return (agent.source.toLowerCase().includes('postman')) ? false : true;
        break;
    }
}

// This module defines context.instance.config.clientBasePath to be later used in template composition.
export default async (context, next) => {
    let clientBasePath, clientSideFolderName;
    let agent = useragentParser.lookup(context.request.headers['user-agent']);

    context.instance.distribution = (isES5(agent)) ? 'polyfill' : 'native'
    switch (context.instance.distribution) {
        case 'polyfill':
            clientSideFolderName = Application.config.distribution.clientSide.polyfill.prefix
        break;
        case 'native':
            clientSideFolderName = Application.config.distribution.clientSide.native.prefix
        break;
    }

    if(Application.config.DEPLOYMENT == 'production')  {
        clientBasePath = Application.config.sourceCodePath
    } else if (Application.config.DEPLOYMENT == 'development') {
        if(Application.config.DISTRIBUTION) {
            clientBasePath = Application.config.distributionPath
        } else {
            clientBasePath = Application.config.sourceCodePath
            clientSideFolderName = Application.config.directory.clientSide.folderName
        }
    }
    
    // set resolved clientSide directory path.
    context.instance.config.clientSidePath = path.join(clientBasePath, clientSideFolderName)
    await next()
}