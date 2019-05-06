"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.serveServerSideRenderedFile = serveServerSideRenderedFile;
exports.renderTemplateDocument = renderTemplateDocument;
exports.serveStaticFile = void 0;

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _underscore = _interopRequireDefault(require("underscore"));

var _koaSendfile = _interopRequireDefault(require("koa-sendfile"));

var _ApplicationClass = _interopRequireDefault(require("../../class/Application.class.js"));

var _middlewarePatternDecorator = require("@dependency/commonPattern/source/middlewarePatternDecorator.js");

var _reusableNestedUnit = _interopRequireDefault(require("../../module/reusableNestedUnit"));

var _getTableDocumentQuery = _interopRequireDefault(require("@dependency/databaseUtility/source/getTableDocument.query.js"));

var _wrapStringStream = require("@dependency/wrapStringStream");

// import serverStatic from 'koa-static' // Static files.
// Static files.
// import mount from 'koa-mount'

/**
 * serve static file.
 * @dependence userAgent middleware
 */
let serveStaticFile = (0, _middlewarePatternDecorator.functionWrappedMiddlewareDecorator)(async function (context, next, option) {
  let relativeFilePath = option.filePath || context.path; // a predefined path or an extracted url path

  let baseFolderRelativePath = option.directoryRelativePath || ''; // additional folder path.

  let clientSidePath = context.instance.config.clientSidePath;

  let absoluteFilePath = _path.default.normalize(_path.default.join(clientSidePath, baseFolderRelativePath, relativeFilePath));

  let fileStats = await (0, _koaSendfile.default)(context, absoluteFilePath);

  if (!fileStats || !fileStats.isFile()) {
    // if file doesn't exist then pass to the next middleware.
    await next();
  } // Previously used - serving directoryPath:
  // let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${setting.directoryPath}`)) 
  // let mountMiddleware = mount(setting.urlPath, serverStatic(`${directoryPath}`, setting.options))

}); // read streams and send them using koa - https://github.com/koajs/koa/issues/944 http://book.mixu.net/node/ch9.html
// TODO: change file name to something like 'render serverside javascript' & convert function to be used for other files not only web components.

exports.serveStaticFile = serveStaticFile;

async function serveServerSideRenderedFile(context, next, option) {
  let clientSidePath = context.instance.config.clientSidePath;
  let baseFolderRelativePath = option.directoryRelativePath || ''; // additional folder path.

  let filePath = option.filePath || context.path; // a predefined path or an extracted url path

  let renderType = option.renderType ? // check if renderType is in nested unit options/arguments if not use the $ in filePath (as all paths should contain $ sign from url because the condition claims it, can be overridden using option argument)
  option.renderType : filePath.substr(filePath.lastIndexOf('$') + 1, filePath.length); // $function extracted from url after '$' signature

  let lastIndexPosition = filePath.lastIndexOf('$') == -1 ? filePath.length : filePath.lastIndexOf('$');
  let relativeFilePath = option.renderType ? filePath : filePath.substr(0, lastIndexPosition); // remove function name

  let absoluteFilePath = _path.default.normalize(_path.default.join(clientSidePath, baseFolderRelativePath, relativeFilePath));

  let renderedContent;

  switch (renderType) {
    case 'convertSharedStylesToJS':
      renderedContent = await convertSharedStylesToJS({
        filePath: absoluteFilePath,
        context
      });
      context.body = renderedContent;
      context.response.type = 'application/javascript';
      await next();
      break;

    case 'covertTextFileToJSModule':
      renderedContent = await covertTextFileToJSModule({
        filePath: absoluteFilePath,
        context
      });
      context.body = renderedContent;
      context.response.type = 'application/javascript';
      await next();
      break;

    case 'renderHTMLImportWebcomponent':
      renderedContent = renderHTMLImportWebcomponent({
        filePath: absoluteFilePath,
        context
      });
      context.body = renderedContent;
      await next();
      break;

    case 'renderJSImportWebcomponent':
      renderedContent = renderJSImportWebcomponent({
        filePath: absoluteFilePath,
        context
      });
      context.response.type = 'application/javascript';
      context.body = renderedContent;
      await next();
      break;

    default:
      if (option.mimeType) {
        // Implementation using filesystem read and underscore template, with a mime type e.g. `application/javascript`
        try {
          // render template
          renderedContent = _fs.default.readFileSync(absoluteFilePath, 'utf8');
          context.body = _underscore.default.template(renderedContent)({
            Application: _ApplicationClass.default,
            context,
            view: {},
            argument: {}
          }); // Koa handles the stream and send it to the client.
          // TODO: detect MIME type automatically and support other mimes. 

          context.response.type = option.mimeType;
        } catch (error) {
          console.log(error);
          await next();
        }
      } else {
        if (_fs.default.existsSync(absoluteFilePath) && _fs.default.statSync(absoluteFilePath).isFile()) {
          // serve rendered file. Implementation using render using underscore (framework like).
          await context.render(absoluteFilePath, {
            context,
            Application: _ApplicationClass.default,
            view: {},
            argument: {
              layoutElement: 'webapp-layout-list'
            }
          });
          context.response.type = _path.default.extname(absoluteFilePath);
          await next();
        } else {
          await next();
        }
      }

      break;
  } // let directoryPath = await path.resolve(path.normalize(`${context.instance.config.clientBasePath}${option.directoryPath}`)) 
  // let mountMiddleware = mount(option.urlPath, serverStatic(`${directoryPath}`, option.options))

}

exports.serveServerSideRenderedFile = serveServerSideRenderedFile = (0, _middlewarePatternDecorator.functionWrappedMiddlewareDecorator)(serveServerSideRenderedFile);

/** Wrap css style in a tag (created using javascript) - to support shared styles in Polymer 3 javascript imports 
 * Polyfill from https://github.com/Polymer/polymer-modulizer/blob/f1ef5dea3978a9601248d73f4d23dc033382286c/fixtures/packages/polymer/expected/test/unit/styling-import-shared-styles.js
*/
async function convertSharedStylesToJS({
  filePath,
  context
}) {
  let fileStream = _fs.default.createReadStream(filePath);

  return await (0, _wrapStringStream.wrapStringStream)({
    stream: fileStream,
    beforeString: "const $_documentContainer = document.createElement('div'); $_documentContainer.setAttribute('style', 'display: none;'); $_documentContainer.innerHTML = \`",
    afterString: '\`;document.head.appendChild($_documentContainer);'
  });
}
/** Wrap text file with export default - converting it to js module */


async function covertTextFileToJSModule({
  filePath,
  context
}) {
  let fileStream = _fs.default.createReadStream(filePath);

  return await (0, _wrapStringStream.wrapStringStream)({
    stream: fileStream,
    beforeString: 'export default \`',
    afterString: '\`'
  });
}
/**
 * Webcomponent using JS imports - Combine webcomponent files according to predefined component parts locations.
 */


function renderJSImportWebcomponent({
  filePath,
  context
}) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'));
  let argument = {
    layoutElement: 'webapp-layout-list'
  };
  let view = {};
  let templatePart = {
    css: _underscore.default.template(_fs.default.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({
      Application: _ApplicationClass.default,
      argument
    }),
    html: _underscore.default.template(_fs.default.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({
      Application: _ApplicationClass.default,
      argument
    })
  };

  try {
    let content = _fs.default.readFileSync(filePath, 'utf8');

    let rendered = _underscore.default.template(content)({
      Application: _ApplicationClass.default,
      view,
      argument: Object.assign(argument, templatePart)
    });

    return rendered; // Koa handles the stream and send it to the client.
  } catch (error) {
    console.log(error);
  }
}
/**
 * Webcomponent using HTML Imports - Combine webcomponent files according to predefined component parts locations.
 */


function renderHTMLImportWebcomponent({
  filePath,
  context
}) {
  let fileDirectoryPath = filePath.substr(0, filePath.lastIndexOf('/'));
  let argument = {
    layoutElement: 'webapp-layout-list'
  };
  let view = {};
  let templatePart = {
    css: _underscore.default.template(_fs.default.readFileSync(`${fileDirectoryPath}/component.css`, 'utf8'))({
      Application: _ApplicationClass.default,
      argument
    }),
    js: _underscore.default.template(_fs.default.readFileSync(`${fileDirectoryPath}/component.js`, 'utf8'))({
      Application: _ApplicationClass.default,
      argument
    }),
    html: _underscore.default.template(_fs.default.readFileSync(`${fileDirectoryPath}/component.html`, 'utf8'))({
      Application: _ApplicationClass.default,
      argument
    })
  };

  try {
    let content = _fs.default.readFileSync(filePath, 'utf8');

    let rendered = _underscore.default.template(content)({
      Application: _ApplicationClass.default,
      view,
      argument: Object.assign(argument, templatePart)
    });

    return rendered; // Koa handles the stream and send it to the client.
  } catch (error) {
    console.log(error);
  }
}
/**
 * Render document using template nested unit tree.
 */


let getTableDocument = {
  generate: _getTableDocumentQuery.default,
  instance: []
};
getTableDocument.instance['template_documentBackend'] = getTableDocument.generate('webappSetting', 'template_documentBackend');

function renderTemplateDocument({
  documentKey
}) {
  let TemplateController = (0, _reusableNestedUnit.default)({
    Superclass: _ApplicationClass.default,
    implementationType: 'Template'
  });
  return async (context, next) => {
    let connection = _ApplicationClass.default.rethinkdbConnection;
    let documentObject = await getTableDocument.instance['template_documentBackend'](connection, documentKey); // context.instance.config.clientBasePath should be defined using useragentDetection module.
    // NOTE:  documentKey should be received from database and nested unit key retreived from there too.
    // document could have different rules for users etc.. access previlages

    let templateController = await TemplateController.createContext({
      portAppInstance: context.instance
    });
    let renderedContent = await templateController.initializeNestedUnit({
      nestedUnitKey: documentObject.templateNestedUnit
    });
    context.body = renderedContent;
    await next();
  };
}