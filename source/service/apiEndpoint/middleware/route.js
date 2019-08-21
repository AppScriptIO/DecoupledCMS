import compose from 'koa-compose'
import Router from 'koa-router'

let routerAPI = new Router({ prefix: '/api/v1' })
routerAPI.get('/test', customQuery.test)

export default () => compose([routerAPI.routes(), routerAPI.allowedMethods()])
