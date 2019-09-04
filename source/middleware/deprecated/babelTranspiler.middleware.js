import config from '../../../configuration/configuration/configuration.export.js'
import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { functionWrappedMiddlewareDecorator } from '../middlewarePatternDecorator.js'
import { streamToString } from '../streamToStringConvertion.js'

let babel, nativeClientSideRuntimeCompilerConfig
if (Application.config.DEPLOYMENT == 'development') {
  // as in production appDeploymentLifecycle dependency doesn't exist.
  babel = require('/project/application/dependency/appDeploymentLifecycle/babel_javascriptTranspilation.js/node_modules/@babel/core')
  nativeClientSideRuntimeCompilerConfig = require(path.normalize(
    `${config.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/compilerConfiguration/nativeClientSideRuntime.BabelConfig.js`,
  ))
}

export let transformJavascript = functionWrappedMiddlewareDecorator(async function(context, next, option) {
  // transpile only on development and non-distribution folders, i.e. on-the-fly transpilation is executed only in development, while production and distribution should be already transpiled.
  if (Application.config.DEPLOYMENT == 'development' && !Application.config.DISTRIBUTION && context.response.type == 'application/javascript') {
    let path = context.path
    let scriptCode = context.body
    let transformBabelPlugin = []

    // in case an npm webcomponent package
    if (path.includes('webcomponent/@package')) transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins
    // in case a custom project element
    else transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins

    let transformBabelPreset = nativeClientSideRuntimeCompilerConfig.presets

    if (transformBabelPlugin.length) {
      // convert stream into string
      if (scriptCode instanceof stream.Stream) scriptCode = await streamToString(scriptCode)
      // transform code using array of plugins.
      let transformedObject = babel.transformSync(scriptCode, { presets: transformBabelPreset, plugins: transformBabelPlugin })
      context.body = transformedObject.code
    }
  }
  await next()
})
