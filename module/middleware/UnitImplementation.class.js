let getTableDocument = {
    generate: require('appscript/utilityFunction/database/query/getTableDocument.query.js'),
    instance: []
}
getTableDocument.instance['middleware_middlewareFile'] = getTableDocument.generate('middleware_middlewareFile')
getTableDocument.instance['middleware_middlewareImplementation'] = getTableDocument.generate('middleware_middlewareImplementation')

module.exports = superclass => {
    let self = class UnitImplementation extends superclass {
        static meta = {
            description: 'Static Middleware Unit'
        }

        async pupolateMiddlewareFile() {
            // [1] get valueReturningFile
            let middlewareFileKey = this.middlewareFile
            if (!('functionPath' in this)) {
                let middlewareFile = await getTableDocument.instance['middleware_middlewareFile'](self.rethinkdbConnection, middlewareFileKey)
                this.functionPath = middlewareFile.filePath
            }
        }
    }
    self.initializeStaticClassControllerLevel(getTableDocument.instance['middleware_middlewareImplementation'])
    self.prototype.meta = {
        description: 'MiddlewareUnit prototype object'
    }
    self = new Proxy(self, {
        construct: function(target, argumentsList, newTarget) {
            let instance = newTarget(...argumentsList)
            instance.meta = {
                description: 'MiddlewareUnit instance/object'
            }
            return instance 
        },
        apply: function(target, thisArg, argumentsList) {
            let instance = target.call(thisArg, ...argumentsList)
            instance.meta = {
                description: 'MiddlewareUnit instance/object'
            }
            return instance
        }
    });
    return self
}