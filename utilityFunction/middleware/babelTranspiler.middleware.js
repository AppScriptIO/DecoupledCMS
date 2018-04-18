import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { default as Application } from '../../class/Application.class.js'
import {functionWrappedMiddlewareDecorator} from '../middlewarePatternDecorator.js'
import { streamToString } from '../streamToStringConvertion.js'
import * as babel from '@babel/core'
const babelDecoratorsPlugin = require(path.normalize(`${config.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/node_modules/babel-plugin-transform-decorators-legacy`))
const babelSyntaxImport = require(path.normalize(`${config.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/node_modules/@babel/plugin-syntax-dynamic-import`))

// babel transform plugin converts name modules beginning with @ to their relative path counterparts.
function transformNamedModuleToPath() {
    return {
        visitor: {
            ImportDeclaration(path) {
                let source = path.node.source
                let newSourceValue;
                if(source.value.startsWith('@')) {
                    newSourceValue = `/@webcomponent/package/${source.value}`
                    source.value = newSourceValue
                }
            }
        }
    }
}

export let transformJavascript = functionWrappedMiddlewareDecorator(async function (context, next, option) {
    if(config.DEPLOYMENT == 'development' && context.response.type == 'application/javascript') {
        let path = context.path
        let scriptCode = context.body
        let transformPlugin = []
        
        if(path.includes('asset/webcomponent/package')) { // in case an npm package
            transformPlugin.push(babelSyntaxImport, transformNamedModuleToPath)
        } else { // in case a custom project element
            transformPlugin.push(babelSyntaxImport, babelDecoratorsPlugin)
        }
        
        if(transformPlugin.length) {        
            // convert stream into string
            if(scriptCode instanceof stream.Stream) scriptCode = await streamToString(scriptCode)
            // transform code using array of plugins.
            context.body = babel.transformSync(scriptCode, { plugins: transformPlugin } ).code
        }
        await next()
    }
})
