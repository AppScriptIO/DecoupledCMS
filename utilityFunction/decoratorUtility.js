export function add({ to = 'static' }, method) {
    return Class => {
        let targetReference;
        switch (to) {
            case 'prototype':
                targetReference = Class.prototype
            break;
            case 'static':
            default:
                targetReference = Class
            break;
        }
        Object.entries(method).forEach(
            ([key, value]) => targetReference[key] = value
        )
        return Class
    }
}

export function execute({ staticMethod, self = true, args = [] }) {
    return Class => {
        if(self) args.unshift(Class) // add to beginning 
        Class[staticMethod](...args)
        return Class
    }
}

export function applyMixin({ mixin = null }) {
    return Class => {
        // add controller methods for the specific module that uses them.
            Class = (mixin) ?
                mixin({ Superclass: Class }) /* return Specific implementation Controller */ : 
                Class /* return Reusable nested unit */;
        return Class
    }
}

// Apply decorator only if condition is true
export function conditional({ condition = true, decorator }) {
    return (condition) ? decorator : Class => { return Class } ; 
}
