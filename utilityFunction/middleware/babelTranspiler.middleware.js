import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { default as Application } from '../../class/Application.class.js'
import {functionWrappedMiddlewareDecorator} from '../middlewarePatternDecorator.js'
import { streamToString } from '../streamToStringConvertion.js'
// const babel1 = require(path.normalize(`${config.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/node_modules/@babel/core`))
// import * as babel from '/project/application/dependency/appDeploymentLifecycle/babel_javascriptTranspilation.js/node_modules/@babel/core' // doesn't work
import * as babel from '/project/application/dependency/appDeploymentLifecycle/babel_javascriptTranspilation.js/node_modules/@babel/core'
const nativeClientSideRuntimeCompilerConfig = require(path.normalize(`${config.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/compilerConfiguration/nativeClientSideRuntime.BabelConfig.js`))

export let transformJavascript = functionWrappedMiddlewareDecorator(async function (context, next, option) {
    if(config.DEPLOYMENT == 'development' && context.response.type == 'application/javascript') {
        let path = context.path
        let scriptCode = context.body
        let transformBabelPlugin = [ ]
        
        if(path.includes('asset/webcomponent/@package')) {  // in case an npm package
            transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins
        } else { // in case a custom project element
            transformBabelPlugin = nativeClientSideRuntimeCompilerConfig.plugins
        }
        let transformBabelPreset = nativeClientSideRuntimeCompilerConfig.presets
        
        if(transformBabelPlugin.length) {
            // convert stream into string
            if(scriptCode instanceof stream.Stream) scriptCode = await streamToString(scriptCode)
            // transform code using array of plugins.
            let transformedObject = babel.transformSync(
                scriptCode,
                { 
                    presets: transformBabelPreset,
                    plugins: transformBabelPlugin
                } 
            )
            context.body = transformedObject.code
        }
        await next()
    }
})
