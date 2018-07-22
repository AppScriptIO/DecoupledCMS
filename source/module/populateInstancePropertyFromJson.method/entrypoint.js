/**
 * @description Creates properties for instance corresponding to the json objects' key-value pairs.
 * @action creates class instance properties.
 * @param  {object} jsonData key-value of object will end up as property-value of class.
 **/
function usingGenericInstance({object, jsonData}) {
    if(jsonData) {
        Object.entries(jsonData).forEach(([key, value]) => {
            object[key] = value
        })
    }
    object.jsonData = jsonData // to keep track of populated instances.
}

function usingThis({ jsonData, object = this }) {
    // console.log(jsonData)
    usingGenericInstance({object, jsonData})
}

export { 
    usingGenericInstance as default,
    usingGenericInstance,
    usingThis
}
