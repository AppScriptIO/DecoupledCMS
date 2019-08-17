import path from 'path'
import serverConfig from '../../../setup/configuration/serverConfig.js'
import { class as Application } from '../../class/Application.class.js'

export default Class => {
  return async (context, next) => {
    let instance = new Class() // create new instance for each request.
    instance.context = context
    context.instance = instance
    await next()
  }
}
