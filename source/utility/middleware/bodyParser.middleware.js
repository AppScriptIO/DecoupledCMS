import parse from 'co-body' // throws on unsupported content type.
import bodyParser from 'koa-bodyparser' // Brings extra option for handling error and unsupported content-types.

export default function() {
  return async (context, next) => {
    // parse request body
    if (context.request.method !== 'OPTIONS') {
      // context.request.body = await parse({
      //     req: context.request
      // })
      await bodyParser()(context, next) // same as co-body but skips co-body parser for unsupported content-type, which prevents co-body from throwing error.
    } else {
      await next()
    }
  }
}
