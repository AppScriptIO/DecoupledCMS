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

export function execute({ staticMethod, args = [] }) {
    return Class => {
        Class[staticMethod](...args)
        return Class
    }
}
