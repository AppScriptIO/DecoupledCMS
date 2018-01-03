import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import serverStatic from 'koa-static' // Static files.
import mount from 'koa-mount'
import serveStaticSingleFileRenderTemplate from 'appscript/utilityFunction/middleware/staticFile/serveStaticSingleFileRenderTemplate.middlewareGenerator.js'
import send from 'koa-sendfile' // Static files.
import filesystem from 'fs'
import Stream from 'stream'
import multistream from 'multistream'

// read streams and send them using koa - https://github.com/koajs/koa/issues/944 http://book.mixu.net/node/ch9.html
// returns a middleware object 
export default function serveStaticDirectory(setting) {
    let middleware = async (context, next) => {
        let fileRelativePath = context.path.substr(0, context.path.lastIndexOf('$')) // remove function name
        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${fileRelativePath}`)) 
        try {
            let stream = await covertTextFileToJSModule({ filePath })
            context.body = stream // Koa handles the stream and send it to the client.
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
    let fileStream = filesystem.createReadStream(filePath)
    let beforeStream = (new Stream.Readable)
    beforeStream.push('export default \`')
    beforeStream.push(null)
    let afterStream = (new Stream.Readable)
    afterStream.push('\`')
    afterStream.push(null)
    return multistream([beforeStream, fileStream, afterStream])
}