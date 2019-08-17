import path from 'path'
import config from '../../../setup/configuration/configuration.export.js' // Load configuration settings.
import send from 'koa-sendfile'
import { class as Application } from '../../class/Application.class.js'

export default () => {
  return async (context, next) => {
    // fallback to sending the app index. If not found.
    await next()
    if (404 != context.status) return
    // return context.body = 'This is the not found middleware.'
    // return send(context, path.normalize(`${context.instance.config.clientBasePath}/root/entrypoint.html`))
  }
}
