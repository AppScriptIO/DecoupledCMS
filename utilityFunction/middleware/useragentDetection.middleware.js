import path from 'path'
const useragentParser = require('useragent') // https://www.npmjs.com/package/useragent
require('useragent/features');
import serverConfig from 'appscript/configuration/serverConfig.js'
import Application from 'appscript'

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
        default:
            return true
        break;
    }
}

export default async (context, next) => {
    let agent = useragentParser.lookup(context.request.headers['user-agent']);
    if(isES5(agent)) {
        context.instance.distribution = 'es5'
        context.instance.config.clientBasePath = await path.resolve(path.normalize(`${Application.config.serverBasePath}/../clientSide-es5`)) 
    } else {
        context.instance.config.clientBasePath = await Application.config.clientBasePath
    }
    await next()
}