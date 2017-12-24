import filesystem from 'fs'
import path from 'path'

export default ({
    localPath,
    implementation,
    dataArray
}) => {
    let tablePrefix = `${implementation}_`
    
    let settingArray = []
    for (let value of dataArray) {
        let setting = { databaseTableName: value }
        let local = [], shared = []
        {
            let modulePath = path.dirname(require.resolve('appscript'))
            let filePath = path.join(modulePath, `databaseData/${implementation}/${value}.js`)
            if(filesystem.existsSync(filePath)) shared = require(filePath)
        }
        {
            let filePath = `${localPath}/${value}.js`
            if(filesystem.existsSync(filePath)) local = require(filePath)
        }
        setting.data = [...shared, ...local]
        if(setting.data.length < 1) console.log(implementation + ' ' + value)
        settingArray.push(setting)
    }

    return settingArray.map(object => {
        object.databaseTableName = tablePrefix.concat(object.databaseTableName)
        return object
    })
}
