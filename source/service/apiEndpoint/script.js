import { createHttpServer } from '../../utility/server.js'
import { graphMiddleware } from './middleware/graphMiddleware.js'
import serviceConfig from './configuration/configuration.js'

/**
Schema: 
fieldname: "personalInfo" --> database/resolver/aggregationPatternResolver.js({databaseTabel: 'personalInfo'})

fieldName: "ui" --> database/resolver/aggregationPatternResolver.js({databaseTabel: 'ui'})
  fieldName: 'title' --> database/resolver/extractFieldFromParentDataset.js

fieldName: "article",  --> database/resolver/aggregationPatternResolver.js({databaseTabel: 'article'})
  fieldName: 'title' --> database/resolver/extractFieldFromParentDataset.js
  fieldName: 'paragraph' --> database/resolver/extractFieldFromParentDataset.js
*/

/**
Api engpoint middleware graph: 
> Request body parser.

/content --> apiContentMessage middleware
/content/* --> apiSchema.middleware.js
*/
export async function initialize({ targetProjectConfig, port = serviceConfig.port }) {
  let middlewareArray = [
    async (context, next) => {
      context.set('connection', 'keep-alive')
      context.set('Access-Control-Allow-Origin', '*')
      await context.req.setTimeout(30000)
      await next()
    },
    await graphMiddleware({ targetProjectConfig }),
    async (context, next) => console.log('last middleware reached.'),
  ]

  // create http server
  await createHttpServer({ label: serviceConfig.serviceName, port: port, middlewareArray })
}
