import getUrlPathAsArray from 'appscript/utilityFunction/conditionCheck/getUrlPathAsArray.js'

export default async (self) => {
    let context = self.context
    let pathArray = await getUrlPathAsArray(self)
    let lastPath = pathArray.pop()
    if(lastPath.includes("?")) lastPath = lastPath.substr(0, lastPath.lastIndexOf('?'))
    return (lastPath.includes('$')) ? true : false;
}