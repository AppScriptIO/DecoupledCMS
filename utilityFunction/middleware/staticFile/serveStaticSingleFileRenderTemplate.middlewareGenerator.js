import Application from 'appscript'
import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import send from 'koa-sendfile' // Static files.
import mount from 'koa-mount'
import _ from 'underscore'

// returns a middleware object 
export default function serveStaticSingleFile(setting) {

    let middleware = async (context, next) => {
        let filePath = path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.filePath}`)) 
        let argument = {
            layoutElement: 'webapp-layout-list'
        }
        let view = {};
        if(setting.urlPath == context.path) {
            return context.render(filePath, {
                Application,
                view,
                argument
            });
        }
        await next()
    }
    return middleware
}

