/*
Template Graph:

  "entrypoint HTML" 73b661df-2f53-498c-a01b-d3db971f1a3e --> execute underscoreRendering template/root/entrypoint.html
    -header
      underscoreRendering template/root/systemjsSetting.js.html
      underscoreRendering template/root/webcomponentPolyfill.js.html
      underscoreRendering template/root/entrypoint.js.html
      underscoreRendering asset/metadata/metadata.html
      underscoreRendering wrapJsTag template/root/babelTranspiler.js
    -bodyOpen
    -bodyClose
      underscoreRendering execute wrapJsTag template/root/serviceWorker.js
      underscoreRendering wrapJsTag template/root/webScoket.js
      underscoreRendering wrapJsTag template/root/googleAnalytics.js
*/

/*
Middleware graph: 

"staticContent": --> execute appscript/utility/middleware/useragentDetection.middleware.js
  1. "Common functionality" 0c01c061-92d4-44ad-8cda-098352c107ea 
  2. NodeReference 68fb59e3-af0b-4ea2-800e-7e7e37d7cc31
  3. "static assets" da18242e-792e-4e44-a12b-b280f6331b7c
  4. NodeReference a7912856-ad5a-46b0-b980-67fb500af399
  5. "Static upload files" 81cc5f3a-ff61-454f-b6bb-49713c841c29

"Root folder & template": --> EMPTY
  "Root template" --> EMPTY
    "Common functions + language content" --> EMPTY
      --> middleware/languageContent.middleware.js
      *"Common functions"
    "static template files" --> arguments: "{"directoryRelativePath":"/template/","options":{"gzip":true}}"
    "renderTemplateDocument - main root template" --> functionWrappedMiddleware arguments: "{"documentKey":"0d65c113-acce-4f01-8eea-ab6cb7152405"}"

"Service worker file wrapper - WebappUI Port"
  *"Common functions"
  "Service worker file" --> middleware/serveFile.middlewareGenerator.js arguments: "{"filePath":"/asset/javascript/serviceWorker/serviceWorker.js","renderType":"default","mimeType":"application/javascript","options":{"gzip":true}}"

"Asset folder redered & common functions"
  *"set response headers + Common functions + language content + cache"
  --> middleware/serveFile.middlewareGenerator.js arguments: "{"options":{"gzip":true}}"

"set response headers + Common functions + language content + cache"
  --> middleware/setResponseHeaders.middleware.js
  "Common functions + language content": 
    --> middleware/languageContent.middleware.js
    *"Common functions"
  --> middleware/cacheControl.middleware.js

"Common functions - Common functionality"
  --> middleware/useragentDetection.middleware.js
  --> middleware/bodyParser.middleware.js
  --> middleware/serverCommonFunctionality.js
  --> middleware/notFound.js

"Upload folder & common functions - CDN Port"
  --> middleware/serveFile.middlewareGenerator.js arguments: "{"directoryRelativePath":"/asset/","options":{"gzip":true}}"
  *"set response headers + Common functions + language content + cache"

"Asset folder & common functions":
  *"set response headers + Common functions + language content + cache"
  --> middleware/serveFile.middlewareGenerator.js Import: "serveStaticFile" arguments: "{"options":{"gzip":true}}"

?This was alone
--> middleware/serveFile.middlewareGenerator.js arguments: ""{"filePath":"/jspm_packageManager/jspm.config.js","urlPath":"/asset/javascript/jspm.config.js","options":{"gzip":true}}""

*/
