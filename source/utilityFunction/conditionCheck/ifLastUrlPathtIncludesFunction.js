import getUrlPathAsArray from './getUrlPathAsArray.js'

export default async self => {
  let context = self.context
  let pathArray = await getUrlPathAsArray(self)
  let lastPath = pathArray.pop() // get url path

  // remove parameters
  if (lastPath.includes('?')) lastPath = lastPath.substr(0, lastPath.lastIndexOf('?'))

  // check if function sign exists
  return lastPath.includes('$') ? true : false
}
