import getUrlPathAsArray from './getUrlPathAsArray.js'

export default async self => {
  let context = self.context
  let pathArray = await getUrlPathAsArray(self)
  return pathArray[0]
}
