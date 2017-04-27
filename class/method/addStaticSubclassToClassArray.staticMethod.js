
/**
 * Get subclasses constructors and add them to Class static property arrray (self.extendedSubclass.static[]).
 * @param  {class|class[]} staticSubclass
 */
 export default function (staticSubclass) {
    const self = this
    let staticSubclassArray = [];
    typeof staticSubclass != 'object' ? staticSubclassArray.push(staticSubclass) : staticSubclassArray = staticSubclass
    staticSubclassArray.map((subclass) => {
        self.extendedSubclass.static[subclass.name] = subclass
    })
}
