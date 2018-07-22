export default async (self) => {
    let context = self.context
    let path = context.request.url // get path

    // Remove parameters starting with "?" after last slash 
    let lastSlash = path.lastIndexOf("/")
    let lastQuestionMark = path.lastIndexOf("?")
    if(lastQuestionMark > lastSlash) path = path.substring(0, lastQuestionMark)

    let pathArray = await path.split("/") // split path sections to an array.
    pathArray = await pathArray.filter(String) // remove empty string.
    pathArray = pathArray.filter(string => !string.startsWith('?')) // remove parameters from individual path in the array. i.e. don't count params as path.
    return pathArray
}