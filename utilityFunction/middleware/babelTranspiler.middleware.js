import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import filesystem from 'fs'
import stream from 'stream'
import { default as Application } from '../../class/Application.class.js'
import {functionWrappedMiddlewareDecorator} from '../middlewarePatternDecorator.js'
import { streamToString } from '../streamToStringConvertion.js'
import * as babel from '@babel/core' // TODO: move babel dependency to babelTranspile folder. import from dependency.
const babelDecoratorsPlugin = require(path.normalize(`${config.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/node_modules/babel-plugin-transform-decorators-legacy`))
const babelSyntaxImport = require(path.normalize(`${config.directory.appDeploymentLifecyclePath}/babel_javascriptTranspilation.js/node_modules/@babel/plugin-syntax-dynamic-import`))

/**
* Babel transform plugin converts name modules beginning with @ to their relative path counterparts or a named module (non-relative path).
* transform example "@polymer/polymer/element.js" --> "/@webcomponent/@package/@polymer/polymer/element.js"
* transform example "lit-html/lib/lit-extended.js" --> "/@webcomponent/@package/lit-html/lib/lit-extended.js"
* https://astexplorer.net/
*/
function transformNamedModuleToPath() {
    return {
        visitor: {
            "ImportDeclaration|ExportNamedDeclaration"(path) {
                let source = path.node.source
                if(!source) return

                let newSourceValue;
                if( 
                    source.value.startsWith('@') || 
                    !source.value.startsWith('/') && !source.value.startsWith('.')
                ) { // if not relative/absolute or starts with @ - basically could be sufficient to check for non relative&absolute path, but for clarity withh keep both conditions.
                    newSourceValue = `/@webcomponent/@package/${source.value}`
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
        let transformPlugin = [babelSyntaxImport]
        
        if(path.includes('asset/webcomponent/@package')) { // in case an npm package
            transformPlugin.push(transformNamedModuleToPath)
        } else { // in case a custom project element
            transformPlugin.push(babelDecoratorsPlugin)
        }
        
        if(transformPlugin.length) {
            // convert stream into string
            if(scriptCode instanceof stream.Stream) scriptCode = await streamToString(scriptCode)
            // transform code using array of plugins.
            let transformedObject = babel.transformSync(
                scriptCode,
                { 
                    plugins: transformPlugin 
                } 
            )

            context.body = transformedObject.code
        }
        await next()
    }
})
