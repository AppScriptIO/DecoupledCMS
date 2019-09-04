export default function() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800')
    await next()
  }
}
