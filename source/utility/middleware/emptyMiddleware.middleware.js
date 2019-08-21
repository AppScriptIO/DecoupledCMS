export default () => {
  return async (context, next) => {
    // fallback to sending the app index. If not found.
    await next()
  }
}
