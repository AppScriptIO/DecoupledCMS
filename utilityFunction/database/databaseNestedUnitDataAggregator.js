import filesystem from 'fs'

export default ({
    localPath,
    implementation,
    dataArray
}) => {
    let tablePrefix = `${implementation}_`
    
    let settingArray = []
    for (let value of dataArray) {
        let setting = { databaseTableName: value }
        setting.data = [] // initialize
        {
            let filePath = `appscript/databaseData/${implementation}/${value}.js`
            if(filesystem.existsSync(filePath)) setting.data.push(require(filePath))
        }
        {
            let filePath = `${localPath}/${value}.js`
            if(filesystem.existsSync(filePath)) setting.data.push(require(filePath))
        }
        settingArray.push(setting)
    }

    return settingArray.map(object => {
        object.databaseTableName = tablePrefix.concat(object.databaseTableName)
        return object
    })
}
