/**
 * @description Creates properties for instance corresponding to the json objects' key-value pairs.
 * @action creates class instance properties.
 * @param  {object} jsonData key-value of object will end up as property-value of class.
 **/
function usingGenericInstance(instance, jsonData) {
    if(jsonData) {
        Object.entries(jsonData).forEach(([key, value]) => {
            instance[key] = value
        })
    }
    instance.jsonData = jsonData // to keep track of populated instances.
}

function usingThis(jsonData) {
    // console.log(jsonData)
    usingGenericInstance(this, jsonData)
}

export { 
    usingGenericInstance as default,
    usingGenericInstance,
    usingThis
}
