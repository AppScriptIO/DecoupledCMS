import path from 'path'
import serverConfig from 'appscript/configuration/serverConfig.js'
import Application from 'appscript'

export default (Class) => {
    return async (context, next) => {
        let instance = new Class() // create new instance for each request.
        instance.context = context; 
        context.instance = instance;
        await next()
    }
}
