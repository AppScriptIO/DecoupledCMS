import config from 'appscript/configuration/configuration.export.js'
import path from 'path'
import filesystem from 'fs'
import { default as Application } from '../../class/Application.class.js'
import {functionWrappedMiddlewareDecorator} from '../middlewarePatternDecorator.js'
import * as babel from '@babel/core'

// babel transform plugin converts name modules beginning with @ to their relative path counterparts.
function transformNamedModuleToPath() {
    return {
        visitor: {
            ImportDeclaration(path) {
                let source = path.node.source
                let newSourceValue;
                if(source.value.startsWith('@')) {
                    newSourceValue = `/@webcomponent/component.package/${source.value}`
                    source.value = newSourceValue
                }
            }
        }
    }
}

// babel.registerPlugin('lolizer', lolizer); 

export let transformNamedModule = functionWrappedMiddlewareDecorator(async function (context, next, option) {
    if(config.DEPLOYMENT == 'development' && context.response.type == 'application/javascript') {
        let scriptCode = context.body
        context.body = babel.transformSync(scriptCode, { plugins: [ transformNamedModuleToPath ] } ).code
    }
    await next()
})
