import parse from 'co-body'

export default function () {
    return async ({ request, response }, next) => { // parse request body
        request.body = await parse({ req: request })
        await next()
    }
}
