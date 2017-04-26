import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import serverStatic from 'koa-static' // Static files.
import mount from 'koa-mount'

// returns a middleware object 
export default function serveStaticDirectory(setting) {
    let middleware = async (context, next) => {
            let directoryPath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`)) 
            let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))
            await mountMiddleware(context, next)
    }
    return middleware
}

