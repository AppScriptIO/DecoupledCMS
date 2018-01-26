import ApiClass from 'appscript/class/port/api/Api.class.js'
import createClassInstancePerRequest from 'appscript/utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import { default as Application } from '../../Application.class.js'

let SchemaController = createStaticInstanceClasses({
    Superclass: Application, 
    implementationType: 'Schema',
    cacheName: true
})

export default ({} = {}) => () => {
    let Class = ApiClass
    let middlewareArray = [
        createClassInstancePerRequest(Class),
        async (context, next) => {
            // instance.middlewareArray.push(middleware)
            context.set('connection', 'keep-alive')
            context.set('Access-Control-Allow-Origin', '*')
            await context.req.setTimeout(30000);                        
            await next()
        },
        async (context, next) => {
            let schemaController = await SchemaController.createContext({ portAppInstance: context.instance })
            let data = await schemaController.initializeNestedUnit({ nestedUnitKey: 'article' })
            context.body = data
            await next()
        },
    ]
    Class.applyKoaMiddleware(middlewareArray)
    Class.createHttpServer()
}