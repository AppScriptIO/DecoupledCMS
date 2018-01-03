import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import serverStatic from 'koa-static' // Static files.
import mount from 'koa-mount'
import serveStaticSingleFileRenderTemplate from 'appscript/utilityFunction/middleware/staticFile/serveStaticSingleFileRenderTemplate.middlewareGenerator.js'
import send from 'koa-sendfile' // Static files.
import filesystem from 'fs'

// returns a middleware object 
// TODO: Change naming 'serverStaticDirectory' as this is no longer mounting directory, maybe should be 'serveStaticFileFromURl'
export default function serveStaticDirectory(setting) {
    let middleware = async (context, next) => {
        let fileRelativePath = context.path.substr(0, context.path.lastIndexOf('$')) // remove function name
        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${fileRelativePath}`)) 
        try {
            let string = await covertTextFileToJSModule({ filePath })
            context.body = string
            context.type = 'application/javascript'
        } catch (error) {
         console.log(error)
         await next()
        }
        // let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`)) 
        // let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))
    }
    return middleware
}

async function covertTextFileToJSModule({ filePath }) {
    let text = filesystem.readFileSync(filePath)
    return `export default \`${text.toString()}\``

}