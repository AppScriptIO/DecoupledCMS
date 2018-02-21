import { default as Application } from '../../../class/Application.class.js'
import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import send from 'koa-sendfile' // Static files.
import mount from 'koa-mount'
import _ from 'underscore'
import filesystem from 'fs'

// returns a middleware object 
export default function serveStaticSingleFile(setting) {
    return async (context, next) => {
        let filePath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.filePath}`)) 
        let argument = {
            layoutElement: 'webapp-layout-list'
        }
        let view = {};
        // let templateFunction = _.template(await filesystem.readFileSync(`${this.portAppInstance.config.clientBasePath}/${unitInstance.filePath}`, 'utf-8'))
        
        await context.render(filePath, {
            Application,
            view,
            argument
        });
        // await next()
    }
}

