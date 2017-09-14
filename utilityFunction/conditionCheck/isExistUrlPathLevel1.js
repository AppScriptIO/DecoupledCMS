import getUrlPathAsArray from 'appscript/utilityFunction/conditionCheck/getUrlPathAsArray.js'

export default async (self) => {
    let context = self.context
    let pathArray = await getUrlPathAsArray(self)
    return (pathArray[0] == null) ? false : true;
}