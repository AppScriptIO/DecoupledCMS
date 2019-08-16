"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _getUrlPathAsArray = _interopRequireDefault(require("./getUrlPathAsArray.js"));var _default =

async self => {
  let context = self.context;
  let pathArray = await (0, _getUrlPathAsArray.default)(self);
  if (pathArray[1] == null) {
    return false;
  } else {
    return pathArray[1];
  }
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS91dGlsaXR5RnVuY3Rpb24vY29uZGl0aW9uQ2hlY2svZ2V0VXJsUGF0aExldmVsMi5qcyJdLCJuYW1lcyI6WyJzZWxmIiwiY29udGV4dCIsInBhdGhBcnJheSJdLCJtYXBwaW5ncyI6InlMQUFBLG1GOztBQUVlLE1BQU1BLElBQU4sSUFBYztBQUMzQixNQUFJQyxPQUFPLEdBQUdELElBQUksQ0FBQ0MsT0FBbkI7QUFDQSxNQUFJQyxTQUFTLEdBQUcsTUFBTSxnQ0FBa0JGLElBQWxCLENBQXRCO0FBQ0EsTUFBSUUsU0FBUyxDQUFDLENBQUQsQ0FBVCxJQUFnQixJQUFwQixFQUEwQjtBQUN4QixXQUFPLEtBQVA7QUFDRCxHQUZELE1BRU87QUFDTCxXQUFPQSxTQUFTLENBQUMsQ0FBRCxDQUFoQjtBQUNEO0FBQ0YsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBnZXRVcmxQYXRoQXNBcnJheSBmcm9tICcuL2dldFVybFBhdGhBc0FycmF5LmpzJ1xuXG5leHBvcnQgZGVmYXVsdCBhc3luYyBzZWxmID0+IHtcbiAgbGV0IGNvbnRleHQgPSBzZWxmLmNvbnRleHRcbiAgbGV0IHBhdGhBcnJheSA9IGF3YWl0IGdldFVybFBhdGhBc0FycmF5KHNlbGYpXG4gIGlmIChwYXRoQXJyYXlbMV0gPT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBwYXRoQXJyYXlbMV1cbiAgfVxufVxuIl19