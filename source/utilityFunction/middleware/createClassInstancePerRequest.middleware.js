"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default =



Class => {
  return async (context, next) => {
    let instance = new Class();
    instance.context = context;
    context.instance = instance;
    await next();
  };
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS91dGlsaXR5RnVuY3Rpb24vbWlkZGxld2FyZS9jcmVhdGVDbGFzc0luc3RhbmNlUGVyUmVxdWVzdC5taWRkbGV3YXJlLmpzIl0sIm5hbWVzIjpbIkNsYXNzIiwiY29udGV4dCIsIm5leHQiLCJpbnN0YW5jZSJdLCJtYXBwaW5ncyI6Ijs7OztBQUllQSxLQUFLLElBQUk7QUFDdEIsU0FBTyxPQUFPQyxPQUFQLEVBQWdCQyxJQUFoQixLQUF5QjtBQUM5QixRQUFJQyxRQUFRLEdBQUcsSUFBSUgsS0FBSixFQUFmO0FBQ0FHLElBQUFBLFFBQVEsQ0FBQ0YsT0FBVCxHQUFtQkEsT0FBbkI7QUFDQUEsSUFBQUEsT0FBTyxDQUFDRSxRQUFSLEdBQW1CQSxRQUFuQjtBQUNBLFVBQU1ELElBQUksRUFBVjtBQUNELEdBTEQ7QUFNRCxDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHBhdGggZnJvbSAncGF0aCdcbmltcG9ydCBzZXJ2ZXJDb25maWcgZnJvbSAnLi4vLi4vLi4vc2V0dXAvY29uZmlndXJhdGlvbi9zZXJ2ZXJDb25maWcuanMnXG5pbXBvcnQgeyBkZWZhdWx0IGFzIEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vY2xhc3MvQXBwbGljYXRpb24uY2xhc3MuanMnXG5cbmV4cG9ydCBkZWZhdWx0IENsYXNzID0+IHtcbiAgcmV0dXJuIGFzeW5jIChjb250ZXh0LCBuZXh0KSA9PiB7XG4gICAgbGV0IGluc3RhbmNlID0gbmV3IENsYXNzKCkgLy8gY3JlYXRlIG5ldyBpbnN0YW5jZSBmb3IgZWFjaCByZXF1ZXN0LlxuICAgIGluc3RhbmNlLmNvbnRleHQgPSBjb250ZXh0XG4gICAgY29udGV4dC5pbnN0YW5jZSA9IGluc3RhbmNlXG4gICAgYXdhaXQgbmV4dCgpXG4gIH1cbn1cbiJdfQ==