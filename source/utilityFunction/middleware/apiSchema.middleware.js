import { default as Application } from '../../class/Application.class.js'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import getUrlPathAsArray from 'appscript/utilityFunction/conditionCheck/getUrlPathAsArray.js'

let SchemaController = createStaticInstanceClasses({
    Superclass: Application, 
    implementationType: 'Schema',
    cacheName: true
})

export default async (context, next) => {
    let connection = Application.rethinkdbConnection
    let schemaController = await SchemaController.createContext({ portAppInstance: context.instance })
    let urlPathArray = await getUrlPathAsArray(context.instance)
    let apiSchemaEntrypoint = urlPathArray.pop()
    let data = await schemaController.initializeNestedUnit({ nestedUnitKey: apiSchemaEntrypoint })
    context.body = data
    await next()
}
