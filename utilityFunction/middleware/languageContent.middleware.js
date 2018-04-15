import parse from 'co-body' // throws on unsupported content type.
import bodyParser from 'koa-bodyparser' // Brings extra option for handling error and unsupported content-types.
import { default as Application } from '../../class/Application.class.js'
import { getMergedMultipleDocumentOfSpecificLanguage as queryPatternImplementation} from "appscript/utilityFunction/database/query/patternImplementation.js";
import {functionWrappedMiddlewareDecorator} from '../middlewarePatternDecorator.js'

export default functionWrappedMiddlewareDecorator(async function (context, next, option) {
        let urlQuery = context.request.query
        let queryLanguage = (urlQuery.language) ?
            urlQuery.language.replace(/\b\w/g, l => l.toUpperCase()) // Capitalize first letter.
            : null ;
        let uiContent = null;
        let defaultLanguage = Application.frontend.setting.mode.language
        try {
            uiContent = await queryPatternImplementation({
                databaseConnection: Application.rethinkdbConnection,
                languageDocumentKey: queryLanguage || defaultLanguage,
                dataTableName: 'ui'
            })
        } catch (error) {
            console.log(error)
        }
    
        context.frontendPerContext = {
            setting: {
                mode: {
                    language: queryLanguage || defaultLanguage // TODO: change setting default twice - fallback to prevent setting a null/undefined over the default value
                }
            },
            uiContent
        }
        await next()
})
