"use strict";Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _default = async self => {
  let context = self.context;
  let path = context.request.url;


  let lastSlash = path.lastIndexOf('/');
  let lastQuestionMark = path.lastIndexOf('?');
  if (lastQuestionMark > lastSlash) path = path.substring(0, lastQuestionMark);

  let pathArray = await path.split('/');
  pathArray = await pathArray.filter(String);
  pathArray = pathArray.filter(string => !string.startsWith('?'));
  return pathArray;
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NvdXJjZS91dGlsaXR5RnVuY3Rpb24vY29uZGl0aW9uQ2hlY2svZ2V0VXJsUGF0aEFzQXJyYXkuanMiXSwibmFtZXMiOlsic2VsZiIsImNvbnRleHQiLCJwYXRoIiwicmVxdWVzdCIsInVybCIsImxhc3RTbGFzaCIsImxhc3RJbmRleE9mIiwibGFzdFF1ZXN0aW9uTWFyayIsInN1YnN0cmluZyIsInBhdGhBcnJheSIsInNwbGl0IiwiZmlsdGVyIiwiU3RyaW5nIiwic3RyaW5nIiwic3RhcnRzV2l0aCJdLCJtYXBwaW5ncyI6Im1IQUFlLE1BQU1BLElBQU4sSUFBYztBQUMzQixNQUFJQyxPQUFPLEdBQUdELElBQUksQ0FBQ0MsT0FBbkI7QUFDQSxNQUFJQyxJQUFJLEdBQUdELE9BQU8sQ0FBQ0UsT0FBUixDQUFnQkMsR0FBM0I7OztBQUdBLE1BQUlDLFNBQVMsR0FBR0gsSUFBSSxDQUFDSSxXQUFMLENBQWlCLEdBQWpCLENBQWhCO0FBQ0EsTUFBSUMsZ0JBQWdCLEdBQUdMLElBQUksQ0FBQ0ksV0FBTCxDQUFpQixHQUFqQixDQUF2QjtBQUNBLE1BQUlDLGdCQUFnQixHQUFHRixTQUF2QixFQUFrQ0gsSUFBSSxHQUFHQSxJQUFJLENBQUNNLFNBQUwsQ0FBZSxDQUFmLEVBQWtCRCxnQkFBbEIsQ0FBUDs7QUFFbEMsTUFBSUUsU0FBUyxHQUFHLE1BQU1QLElBQUksQ0FBQ1EsS0FBTCxDQUFXLEdBQVgsQ0FBdEI7QUFDQUQsRUFBQUEsU0FBUyxHQUFHLE1BQU1BLFNBQVMsQ0FBQ0UsTUFBVixDQUFpQkMsTUFBakIsQ0FBbEI7QUFDQUgsRUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNFLE1BQVYsQ0FBaUJFLE1BQU0sSUFBSSxDQUFDQSxNQUFNLENBQUNDLFVBQVAsQ0FBa0IsR0FBbEIsQ0FBNUIsQ0FBWjtBQUNBLFNBQU9MLFNBQVA7QUFDRCxDIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgYXN5bmMgc2VsZiA9PiB7XG4gIGxldCBjb250ZXh0ID0gc2VsZi5jb250ZXh0XG4gIGxldCBwYXRoID0gY29udGV4dC5yZXF1ZXN0LnVybCAvLyBnZXQgcGF0aFxuXG4gIC8vIFJlbW92ZSBwYXJhbWV0ZXJzIHN0YXJ0aW5nIHdpdGggXCI/XCIgYWZ0ZXIgbGFzdCBzbGFzaFxuICBsZXQgbGFzdFNsYXNoID0gcGF0aC5sYXN0SW5kZXhPZignLycpXG4gIGxldCBsYXN0UXVlc3Rpb25NYXJrID0gcGF0aC5sYXN0SW5kZXhPZignPycpXG4gIGlmIChsYXN0UXVlc3Rpb25NYXJrID4gbGFzdFNsYXNoKSBwYXRoID0gcGF0aC5zdWJzdHJpbmcoMCwgbGFzdFF1ZXN0aW9uTWFyaylcblxuICBsZXQgcGF0aEFycmF5ID0gYXdhaXQgcGF0aC5zcGxpdCgnLycpIC8vIHNwbGl0IHBhdGggc2VjdGlvbnMgdG8gYW4gYXJyYXkuXG4gIHBhdGhBcnJheSA9IGF3YWl0IHBhdGhBcnJheS5maWx0ZXIoU3RyaW5nKSAvLyByZW1vdmUgZW1wdHkgc3RyaW5nLlxuICBwYXRoQXJyYXkgPSBwYXRoQXJyYXkuZmlsdGVyKHN0cmluZyA9PiAhc3RyaW5nLnN0YXJ0c1dpdGgoJz8nKSkgLy8gcmVtb3ZlIHBhcmFtZXRlcnMgZnJvbSBpbmRpdmlkdWFsIHBhdGggaW4gdGhlIGFycmF5LiBpLmUuIGRvbid0IGNvdW50IHBhcmFtcyBhcyBwYXRoLlxuICByZXR1cm4gcGF0aEFycmF5XG59XG4iXX0=