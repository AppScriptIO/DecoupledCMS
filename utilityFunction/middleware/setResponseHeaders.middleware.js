
export default function () {
    return async (context, next) => {
        // instance.middlewareArray.push(middleware)
        // await context.req.setTimeout(0); // changes default Nodejs timeout (default 120 seconds).          
        await context.set('Access-Control-Allow-Origin', '*')
        await context.set('connection', 'keep-alive')
        await next()
    }
}
