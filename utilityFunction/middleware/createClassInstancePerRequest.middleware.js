import path from 'path'
import serverConfig from 'appscript/configuration/serverConfig.js'
import { default as Application } from '../../class/Application.class.js'

export default (Class) => {
    return async (context, next) => {
        let instance = new Class() // create new instance for each request.
        instance.context = context; 
        context.instance = instance;
        await next()
    }
}
