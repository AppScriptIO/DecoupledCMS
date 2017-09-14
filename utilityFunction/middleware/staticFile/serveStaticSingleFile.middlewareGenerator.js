import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import send from 'koa-sendfile' // Static files.

// returns a middleware object 
export default function serveStaticSingleFile(setting) {
    let middleware = async (context, next) => {
        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.filePath}`)) 
        return send(context, filePath);
        await next()
    }
    return middleware
}

