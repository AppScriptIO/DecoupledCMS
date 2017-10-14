import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import serverStatic from 'koa-static' // Static files.
import mount from 'koa-mount'
import serveStaticSingleFileRenderTemplate from 'appscript/utilityFunction/middleware/staticFile/serveStaticSingleFileRenderTemplate.middlewareGenerator.js'
import send from 'koa-sendfile' // Static files.

// returns a middleware object 
// TODO: Change naming 'serverStaticDirectory' as this is no longer mounting directory, maybe should be 'serveStaticFileFromURl'
export default function serveStaticDirectory(setting) {
    let middleware = async (context, next) => {

        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${context.path}`)) 
        let fileStats = await send(context, filePath);
        if(!fileStats || !fileStats.isFile()) { // if file doesn't exist then pass to the next middleware.
            await next()
        }
                
        // let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`)) 
        // let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))
    }
    return middleware
}

