"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
let data = [{
  label: {
    name: 'Empty middleware for creating chains'
  },
  key: 'empty',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: '350d2024-49ad-4c6a-afa1-f348b212170f'
}, {
  label: {
    name: 'useragentDetection'
  },
  key: '3544ab32-f236-4e66-aacd-6fdf20df069b',
  importModuleName: 'default',
  executionType: 'middleware',
  fileKey: '1f7531cc-1302-4eab-93f1-d48a1aec07b9'
}, {
  label: {
    name: 'commonFunctionality middlewares'
  },
  key: '73873bfd-a667-4de3-900c-c06320e8dc67',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: '18afb17a-bf49-4bae-a5ba-02a12494d8e2'
}, {
  label: {
    name: 'notFound'
  },
  key: '5e93b08c-557a-4d67-adc7-a06447f4ebad',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: '45f46e34-0586-4b63-9641-afc034343acb'
}, {
  label: {
    name: 'body parser'
  },
  key: '984safdasf-0ae9-4dd0-aae8-4796bbe0581f',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: '6784asfd-e22b-4a07-83d0-1ff2c1d51902'
}, {
  label: {
    name: 'languageContent'
  },
  key: '8av2-4dd0-aae8-4796bbe0581f',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: 'asdf8922-4a07-83d0-1ff2c1d51902'
}, {
  label: {
    name: 'setResponseHeaders'
  },
  key: '8f8f8f-3asa3-6d66-4796bbe0581f',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: 'qp93-e22b-4a07-83d0-1ff2c1d51902'
}, {
  label: {
    name: 'Service worker file serving it in top url level, which determines the scope of service worker.'
  },
  key: '7a33a77a-4679-41e0-984a-8be96e56526d',
  arguments: {
    filePath: `/asset/javascript/serviceWorker/serviceWorker.js`,
    renderType: 'default',
    mimeType: 'application/javascript',
    options: {
      gzip: true
    }
  },
  importModuleName: 'serveServerSideRenderedFile',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'Static template files'
  },
  key: '20c4b7dd-66de-4b89-9188-f1601f9fc217',
  arguments: {
    directoryRelativePath: `/template/`,
    options: {
      gzip: true
    }
  },
  importModuleName: 'serveStaticFile',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'Static upload files'
  },
  key: '8w7g2-0ae9-4dd0-aae8-4796bbe0581f',
  arguments: {
    directoryRelativePath: `/asset/`,
    options: {
      gzip: true
    }
  },
  importModuleName: 'serveStaticFile',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'RenderTemplateDocument - main root template'
  },
  key: '122c9a40-5872-4219-ad4e-ad1c237deacd',
  arguments: {
    documentKey: '518d7b08-f825-486d-be88-1a4df2653022'
  },
  importModuleName: 'renderTemplateDocument',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'static assets'
  },
  key: 'c2539d29-d217-41c9-a984-a17d741946c5',
  arguments: {
    /* directoryPath: `/asset/`, */
    options: {
      gzip: true
    }
  },
  importModuleName: 'serveStaticFile',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'render files'
  },
  key: 'qwv35-41c9-a984-a17d741946c5',
  arguments: {
    /* directoryPath: `/asset/`, */
    options: {
      gzip: true
    }
  },
  importModuleName: 'serveServerSideRenderedFile',
  executionType: 'functionWrappedMiddleware',
  fileKey: '81902e75-17a0-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'Map @ folder path'
  },
  key: 'xyz12-a984-a17d741946c5',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: 'iopjh-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'Transform ES javascript -  named module to allowed path'
  },
  key: '1882-q2f-a17d741946c5',
  importModuleName: 'transformJavascript',
  executionType: 'functionWrappedMiddleware',
  fileKey: '33q33-41a1-a12d-e5d4446e85d9'
}, {
  label: {
    name: 'Add header cacheControl.middleware.js'
  },
  key: '5yuk3-sadf9-a17d741946c5',
  importModuleName: 'default',
  executionType: 'functionWrappedMiddleware',
  fileKey: '8asf95-9sdaf5-e5d4446e85d9'
}];
var _default = data;
exports.default = _default;