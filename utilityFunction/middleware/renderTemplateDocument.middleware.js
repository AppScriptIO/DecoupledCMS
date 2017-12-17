import Application from 'appscript'
import createStaticInstanceClasses from 'appscript/module/reusableNestedUnit'
import {default as getTableDocumentDefault} from "appscript/utilityFunction/database/query/getTableDocument.query.js";

let getTableDocument = {
    generate: getTableDocumentDefault,
    instance: []
}
getTableDocument.instance['template_documentBackend'] = getTableDocument.generate('template_documentBackend')

export default ({ documentKey }) => {
    let TemplateController = createStaticInstanceClasses({ 
        Superclass: Application, 
        implementationType: 'Template'
    })
    return async (context, next) => {
        let connection = Application.rethinkdbConnection
        let documentObject = await getTableDocument.instance['template_documentBackend'](connection, documentKey)
        // context.instance.config.clientBasePath should be defined using useragentDetection module.
        // NOTE:  documentKey should be received from database and nested unit key retreived from there too.
        // document could have different rules for users etc.. access previlages
        let templateController = await TemplateController.createContext({ portAppInstance: context.instance })
        
        let renderedContent = await templateController.initializeNestedUnit({ nestedUnitKey: documentObject.templateNestedUnit })
        context.body = renderedContent;
    
        await next()
    }
}
