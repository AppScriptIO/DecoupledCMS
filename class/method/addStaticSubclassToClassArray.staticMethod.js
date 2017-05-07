
/**
 * Get subclasses constructors and add them to Class static property arrray (self.extendedSubclass.static[]).
 * @param  {class{}} staticSubclass
 */
 export default function (staticSubclass) {
    const self = this
    if(!staticSubclass) return;
    Object.entries(staticSubclass).forEach(([key, value]) => {
        self.extendedSubclass.static[key] = value
    });
}
