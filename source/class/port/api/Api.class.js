// API server
import Koa from 'koa' // Koa applicaiton server
import { default as Application } from '../../Application.class.js'
import { add, execute, applyMixin } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

const self =
  @execute({ staticMethod: 'initializeStaticClass' })
  @extendedSubclassPattern.Subclass()
  class Api extends Application {
    static serverKoa
    static port
    static url
    static middlewareArray = []
    middlewareArray = []

    static initializeStaticClass(self) {
      super.initializeStaticClass()
      self.port = 8082
      self.url = `${self.config.PROTOCOL}api.${self.config.HOST}/`
    }
    constructor() {
      super(true)
    }
  }

export default self
