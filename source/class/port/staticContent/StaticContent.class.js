// Static content server - could be upgraded to Content Delivery Network
import Koa from 'koa' // Koa applicaiton server
import { class as Application } from '../../Application.class.js'
import { add, execute, applyMixin } from '@dependency/commonPattern/source/decoratorUtility.js'
import { extendedSubclassPattern } from '@dependency/commonPattern/source/extendedSubclassPattern.js'

const self =
  @execute({ staticMethod: 'initializeStaticClass' })
  @extendedSubclassPattern.Subclass()
  class StaticContent extends Application {
    static serverKoa
    static port
    static url
    static middlewareArray = []
    middlewareArray = []

    static initializeStaticClass(self) {
      super.initializeStaticClass()
      self.port = 8081
      self.url = `${self.config.PROTOCOL}cdn.${self.config.HOST}`
    }
    constructor() {
      super(true)
      this.config = {} // populated by useragentDetection module.
    }
  }

export default self
