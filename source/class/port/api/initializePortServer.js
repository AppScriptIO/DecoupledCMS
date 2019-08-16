import ApiClass from './Api.class.js'
import createClassInstancePerRequest from '../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js'
import createStaticInstanceClasses from '../../../module/reusableNestedUnit'
import { default as Application } from '../../Application.class.js'
import implementConditionActionOnModuleUsingJson from '../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js'
import implementMiddlewareOnModuleUsingJson from '../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js' // Middleware extending server functionality

let MiddlewareController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Middleware',
  cacheName: true,
})

let ConditionController = createStaticInstanceClasses({
  Superclass: Application,
  implementationType: 'Condition',
  cacheName: true,
})

export default ({} = {}) => async () => {
  let Class = ApiClass
  let middlewareArray = [
    createClassInstancePerRequest(Class),
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    async (context, next) => {
      // MIDDLEWARE e.g. body parser
      let middlewareArray
      let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance })
      middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: '84sfad-f783-410e-a5c9-a21679a45beb' })
      await implementMiddlewareOnModuleUsingJson(middlewareArray)(context, next)
    },
    async (context, next) => {
      let conditionController = await ConditionController.createContext({ portAppInstance: context.instance })
      let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' })
      let isCalledNext = await implementConditionActionOnModuleUsingJson({ setting: callback })(context, next)
      if (!isCalledNext) await next()
    },
    async (context, next) => {
      // console.log('Reached last middleware')
    },
  ]
  Class.applyKoaMiddleware(middlewareArray)
  await Class.createHttpServer()
}
