export default async (self) => {
    let context = self.context
    let path = context.request.url // get path
    let pathArray = await path.split("/") // split path sections to an array.
    pathArray = await pathArray.filter(String) // remove empty string.
    return pathArray
}