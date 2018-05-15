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
    let agent = useragentParser.lookup(context.request.headers['user-agent']);
    if(process.env.DISTRIBUTION) {
        
        if(isES5(agent)) { 
            context.instance.distribution = 'polyfill' 
        } else {
            context.instance.distribution = 'native' 
        }
        
        let basePath;
        if(process.env.DEPLOYMENT == 'production')  {
            basePath = Application.config.clientBasePath
        } else if (process.env.DEPLOYMENT == 'development') {
            basePath = Application.config.distributionPath
        }
        
        let clientSideFolderName;
        switch (context.instance.distribution) {
            case 'polyfill':
                clientSideFolderName = Application.config.distribution.clientSide.polyfill.prefix
                context.instance.config.clientBasePath = path.join(basePath, clientSideFolderName)
            break;
            case 'native':
                clientSideFolderName = Application.config.distribution.clientSide.native.prefix
                context.instance.config.clientBasePath = path.join(basePath, clientSideFolderName)
            break;
            default: 
                context.instance.config.clientBasePath = Application.config.clientBasePath
            break;
        }
    } else {
        context.instance.config.clientBasePath = Application.config.clientBasePath
    }

    await next()
}