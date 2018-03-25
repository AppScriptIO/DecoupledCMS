import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import send from 'koa-sendfile' // Static files.
import underscore from 'underscore'
import filesystem from 'fs'
import { default as Application } from '../../../class/Application.class.js'

// returns a middleware object 
export default function serveStaticSingleFile(setting) {
    let middleware = async (context, next) => {
        
        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.filePath}`)) 
        if(context.path.lastIndexOf('$') > -1) {
            try {
                // render template
                let content = filesystem.readFileSync(filePath, 'utf8')
                let rendered = underscore.template(content)({ Application, view: {}, argument: {}})
                context.body = rendered // Koa handles the stream and send it to the client.
                // TODO: detect MIME type automatically and support other mimes. 
                context.type = 'application/javascript'
            } catch (error) {
                console.log(error)
                await next()
            }
        } else {
            return send(context, filePath);
        }
        // await next()
    }
    return middleware
}

