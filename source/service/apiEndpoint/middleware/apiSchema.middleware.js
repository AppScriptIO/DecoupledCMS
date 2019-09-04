import getUrlPathAsArray from '../conditionCheck/getUrlPathAsArray.js'

export default async (context, next) => {
  let schemaController = await SchemaController.createContext({ portAppInstance: context.instance })
  let urlPathArray = await getUrlPathAsArray(context.instance)
  let apiSchemaEntrypoint = urlPathArray.pop()
  let data = await schemaController.initializeNestedUnit({ nestedUnitKey: apiSchemaEntrypoint })
  context.body = data
  await next()
}
