import getUrlPathAsArray from './getUrlPathAsArray.js'

export default async self => {
  let context = self.context
  let pathArray = await getUrlPathAsArray(self)
  let firstPath = pathArray.shift() // get url path

  // check if function sign exists
  return firstPath.includes('@') ? true : false
}
