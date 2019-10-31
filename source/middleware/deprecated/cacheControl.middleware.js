"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = _default;function _default() {
  return async (context, next) => {
    context.set('Cache-Control', 'max-age=604800');
    await next();
  };
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS9taWRkbGV3YXJlL2RlcHJlY2F0ZWQvY2FjaGVDb250cm9sLm1pZGRsZXdhcmUuanMiXSwibmFtZXMiOlsiY29udGV4dCIsIm5leHQiLCJzZXQiXSwibWFwcGluZ3MiOiJzR0FBZSxvQkFBVztBQUN4QixTQUFPLE9BQU9BLE9BQVAsRUFBZ0JDLElBQWhCLEtBQXlCO0FBQzlCRCxJQUFBQSxPQUFPLENBQUNFLEdBQVIsQ0FBWSxlQUFaLEVBQTZCLGdCQUE3QjtBQUNBLFVBQU1ELElBQUksRUFBVjtBQUNELEdBSEQ7QUFJRCIsInNvdXJjZXNDb250ZW50IjpbImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gYXN5bmMgKGNvbnRleHQsIG5leHQpID0+IHtcbiAgICBjb250ZXh0LnNldCgnQ2FjaGUtQ29udHJvbCcsICdtYXgtYWdlPTYwNDgwMCcpXG4gICAgYXdhaXQgbmV4dCgpXG4gIH1cbn1cbiJdfQ==