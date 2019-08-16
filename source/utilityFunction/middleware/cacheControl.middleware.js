"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = _default;function _default() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800');
    await next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS91dGlsaXR5RnVuY3Rpb24vbWlkZGxld2FyZS9jYWNoZUNvbnRyb2wubWlkZGxld2FyZS5qcyJdLCJuYW1lcyI6WyJjb250ZXh0IiwibmV4dCIsInNldCJdLCJtYXBwaW5ncyI6InNHQUFlLG9CQUFXO0FBQ3hCLFNBQU8sT0FBT0EsT0FBUCxFQUFnQkMsSUFBaEIsS0FBeUI7QUFDOUJELElBQUFBLE9BQU8sQ0FBQ0UsR0FBUixDQUFZLGVBQVosRUFBNkIsZ0JBQTdCO0FBQ0EsVUFBTUQsSUFBSSxFQUFWO0FBQ0QsR0FIRDtBQUlEIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oKSB7XG4gIHJldHVybiBhc3luYyAoY29udGV4dCwgbmV4dCkgPT4ge1xuICAgIGNvbnRleHQuc2V0KCdDYWNoZS1Db250cm9sJywgJ21heC1hZ2U9NjA0ODAwJylcbiAgICBhd2FpdCBuZXh0KClcbiAgfVxufVxuIl19