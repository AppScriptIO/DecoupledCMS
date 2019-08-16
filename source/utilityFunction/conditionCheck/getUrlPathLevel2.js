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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS91dGlsaXR5RnVuY3Rpb24vY29uZGl0aW9uQ2hlY2svZ2V0VXJsUGF0aExldmVsMi5qcyJdLCJuYW1lcyI6WyJzZWxmIiwiY29udGV4dCIsInBhdGhBcnJheSJdLCJtYXBwaW5ncyI6InlMQUFBLG1GOztBQUVlLE1BQU9BLElBQVAsSUFBZ0I7QUFDM0IsTUFBSUMsT0FBTyxHQUFHRCxJQUFJLENBQUNDLE9BQW5CO0FBQ0EsTUFBSUMsU0FBUyxHQUFHLE1BQU0sZ0NBQWtCRixJQUFsQixDQUF0QjtBQUNBLE1BQUdFLFNBQVMsQ0FBQyxDQUFELENBQVQsSUFBZ0IsSUFBbkIsRUFBeUI7QUFDckIsV0FBTyxLQUFQO0FBQ0gsR0FGRCxNQUVPO0FBQ0gsV0FBT0EsU0FBUyxDQUFDLENBQUQsQ0FBaEI7QUFDSDtBQUNKLEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZ2V0VXJsUGF0aEFzQXJyYXkgZnJvbSAnLi9nZXRVcmxQYXRoQXNBcnJheS5qcydcblxuZXhwb3J0IGRlZmF1bHQgYXN5bmMgKHNlbGYpID0+IHtcbiAgICBsZXQgY29udGV4dCA9IHNlbGYuY29udGV4dFxuICAgIGxldCBwYXRoQXJyYXkgPSBhd2FpdCBnZXRVcmxQYXRoQXNBcnJheShzZWxmKVxuICAgIGlmKHBhdGhBcnJheVsxXSA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBwYXRoQXJyYXlbMV1cbiAgICB9XG59Il19