// API server
import Koa from 'koa' // Koa applicaiton server
import WebappUIClass from 'class/WebappUI.class.js'
import ConditionTreeClass from 'class/ConditionTree.class.js'

class Test extends WebappUIClass {
  middlewareArray = []

  constructor() {
    super(true)
    this.port = 8083
    this.createKoaServer()
  }

  createKoaServer() {
    this.serverKoa = new Koa() // export if script is required.
  }

  applyKoaMiddleware() {
    this.middlewareArray.forEach(middleware => {
      this.serverKoa.use(middleware)
    }, this)
  }
}

export default Test
