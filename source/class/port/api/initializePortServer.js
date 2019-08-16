"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _ApiClass = _interopRequireDefault(require("./Api.class.js"));
var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));
var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));
var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));
var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));
var _implementMiddlewareOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js"));

let MiddlewareController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Middleware',
  cacheName: true });


let ConditionController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Condition',
  cacheName: true });var _default =


({} = {}) => async () => {
  let Class = _ApiClass.default;
  let middlewareArray = [
  (0, _createClassInstancePerRequestMiddleware.default)(Class),
  async (context, next) => {
    context.set('connection', 'keep-alive');
    context.set('Access-Control-Allow-Origin', '*');
    await context.req.setTimeout(30000);
    await next();
  },
  async (context, next) => {

    let middlewareArray;
    let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance });
    middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: '84sfad-f783-410e-a5c9-a21679a45beb' });
    await (0, _implementMiddlewareOnModuleUsingJson.default)(middlewareArray)(context, next);
  },
  async (context, next) => {
    let conditionController = await ConditionController.createContext({ portAppInstance: context.instance });
    let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: 'asdf8-d9fb-4890-a6e9-51052a8c011f' });
    let isCalledNext = await (0, _implementConditionActionOnModuleUsingJson.default)({ setting: callback })(context, next);
    if (!isCalledNext) await next();
  },
  async (context, next) => {

  }];

  Class.applyKoaMiddleware(middlewareArray);
  await Class.createHttpServer();
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jbGFzcy9wb3J0L2FwaS9pbml0aWFsaXplUG9ydFNlcnZlci5qcyJdLCJuYW1lcyI6WyJNaWRkbGV3YXJlQ29udHJvbGxlciIsIlN1cGVyY2xhc3MiLCJBcHBsaWNhdGlvbiIsImltcGxlbWVudGF0aW9uVHlwZSIsImNhY2hlTmFtZSIsIkNvbmRpdGlvbkNvbnRyb2xsZXIiLCJDbGFzcyIsIkFwaUNsYXNzIiwibWlkZGxld2FyZUFycmF5IiwiY29udGV4dCIsIm5leHQiLCJzZXQiLCJyZXEiLCJzZXRUaW1lb3V0IiwibWlkZGxld2FyZUNvbnRyb2xsZXIiLCJjcmVhdGVDb250ZXh0IiwicG9ydEFwcEluc3RhbmNlIiwiaW5zdGFuY2UiLCJpbml0aWFsaXplTmVzdGVkVW5pdCIsIm5lc3RlZFVuaXRLZXkiLCJjb25kaXRpb25Db250cm9sbGVyIiwiY2FsbGJhY2siLCJpc0NhbGxlZE5leHQiLCJzZXR0aW5nIiwiYXBwbHlLb2FNaWRkbGV3YXJlIiwiY3JlYXRlSHR0cFNlcnZlciJdLCJtYXBwaW5ncyI6InlMQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxJQUFJQSxvQkFBb0IsR0FBRyxpQ0FBNEI7QUFDckRDLEVBQUFBLFVBQVUsRUFBRUMseUJBRHlDO0FBRXJEQyxFQUFBQSxrQkFBa0IsRUFBRSxZQUZpQztBQUdyREMsRUFBQUEsU0FBUyxFQUFFLElBSDBDLEVBQTVCLENBQTNCOzs7QUFNQSxJQUFJQyxtQkFBbUIsR0FBRyxpQ0FBNEI7QUFDcERKLEVBQUFBLFVBQVUsRUFBRUMseUJBRHdDO0FBRXBEQyxFQUFBQSxrQkFBa0IsRUFBRSxXQUZnQztBQUdwREMsRUFBQUEsU0FBUyxFQUFFLElBSHlDLEVBQTVCLENBQTFCLEM7OztBQU1lLENBQUMsS0FBSyxFQUFOLEtBQWEsWUFBWTtBQUN0QyxNQUFJRSxLQUFLLEdBQUdDLGlCQUFaO0FBQ0EsTUFBSUMsZUFBZSxHQUFHO0FBQ3BCLHdEQUE4QkYsS0FBOUIsQ0FEb0I7QUFFcEIsU0FBT0csT0FBUCxFQUFnQkMsSUFBaEIsS0FBeUI7QUFDdkJELElBQUFBLE9BQU8sQ0FBQ0UsR0FBUixDQUFZLFlBQVosRUFBMEIsWUFBMUI7QUFDQUYsSUFBQUEsT0FBTyxDQUFDRSxHQUFSLENBQVksNkJBQVosRUFBMkMsR0FBM0M7QUFDQSxVQUFNRixPQUFPLENBQUNHLEdBQVIsQ0FBWUMsVUFBWixDQUF1QixLQUF2QixDQUFOO0FBQ0EsVUFBTUgsSUFBSSxFQUFWO0FBQ0QsR0FQbUI7QUFRcEIsU0FBT0QsT0FBUCxFQUFnQkMsSUFBaEIsS0FBeUI7O0FBRXZCLFFBQUlGLGVBQUo7QUFDQSxRQUFJTSxvQkFBb0IsR0FBRyxNQUFNZCxvQkFBb0IsQ0FBQ2UsYUFBckIsQ0FBbUMsRUFBRUMsZUFBZSxFQUFFUCxPQUFPLENBQUNRLFFBQTNCLEVBQW5DLENBQWpDO0FBQ0FULElBQUFBLGVBQWUsR0FBRyxNQUFNTSxvQkFBb0IsQ0FBQ0ksb0JBQXJCLENBQTBDLEVBQUVDLGFBQWEsRUFBRSxvQ0FBakIsRUFBMUMsQ0FBeEI7QUFDQSxVQUFNLG1EQUFxQ1gsZUFBckMsRUFBc0RDLE9BQXRELEVBQStEQyxJQUEvRCxDQUFOO0FBQ0QsR0FkbUI7QUFlcEIsU0FBT0QsT0FBUCxFQUFnQkMsSUFBaEIsS0FBeUI7QUFDdkIsUUFBSVUsbUJBQW1CLEdBQUcsTUFBTWYsbUJBQW1CLENBQUNVLGFBQXBCLENBQWtDLEVBQUVDLGVBQWUsRUFBRVAsT0FBTyxDQUFDUSxRQUEzQixFQUFsQyxDQUFoQztBQUNBLFFBQUlJLFFBQVEsR0FBRyxNQUFNRCxtQkFBbUIsQ0FBQ0Ysb0JBQXBCLENBQXlDLEVBQUVDLGFBQWEsRUFBRSxtQ0FBakIsRUFBekMsQ0FBckI7QUFDQSxRQUFJRyxZQUFZLEdBQUcsTUFBTSx3REFBMEMsRUFBRUMsT0FBTyxFQUFFRixRQUFYLEVBQTFDLEVBQWlFWixPQUFqRSxFQUEwRUMsSUFBMUUsQ0FBekI7QUFDQSxRQUFJLENBQUNZLFlBQUwsRUFBbUIsTUFBTVosSUFBSSxFQUFWO0FBQ3BCLEdBcEJtQjtBQXFCcEIsU0FBT0QsT0FBUCxFQUFnQkMsSUFBaEIsS0FBeUI7O0FBRXhCLEdBdkJtQixDQUF0Qjs7QUF5QkFKLEVBQUFBLEtBQUssQ0FBQ2tCLGtCQUFOLENBQXlCaEIsZUFBekI7QUFDQSxRQUFNRixLQUFLLENBQUNtQixnQkFBTixFQUFOO0FBQ0QsQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBBcGlDbGFzcyBmcm9tICcuL0FwaS5jbGFzcy5qcydcbmltcG9ydCBjcmVhdGVDbGFzc0luc3RhbmNlUGVyUmVxdWVzdCBmcm9tICcuLi8uLi8uLi91dGlsaXR5RnVuY3Rpb24vbWlkZGxld2FyZS9jcmVhdGVDbGFzc0luc3RhbmNlUGVyUmVxdWVzdC5taWRkbGV3YXJlLmpzJ1xuaW1wb3J0IGNyZWF0ZVN0YXRpY0luc3RhbmNlQ2xhc3NlcyBmcm9tICcuLi8uLi8uLi9tb2R1bGUvcmV1c2FibGVOZXN0ZWRVbml0J1xuaW1wb3J0IHsgZGVmYXVsdCBhcyBBcHBsaWNhdGlvbiB9IGZyb20gJy4uLy4uL0FwcGxpY2F0aW9uLmNsYXNzLmpzJ1xuaW1wb3J0IGltcGxlbWVudENvbmRpdGlvbkFjdGlvbk9uTW9kdWxlVXNpbmdKc29uIGZyb20gJy4uLy4uLy4uL3V0aWxpdHlGdW5jdGlvbi9taWRkbGV3YXJlL2ltcGxlbWVudENvbmRpdGlvbkFjdGlvbk9uTW9kdWxlVXNpbmdKc29uLmpzJ1xuaW1wb3J0IGltcGxlbWVudE1pZGRsZXdhcmVPbk1vZHVsZVVzaW5nSnNvbiBmcm9tICcuLi8uLi8uLi91dGlsaXR5RnVuY3Rpb24vbWlkZGxld2FyZS9pbXBsZW1lbnRNaWRkbGV3YXJlT25Nb2R1bGVVc2luZ0pzb24uanMnIC8vIE1pZGRsZXdhcmUgZXh0ZW5kaW5nIHNlcnZlciBmdW5jdGlvbmFsaXR5XG5cbmxldCBNaWRkbGV3YXJlQ29udHJvbGxlciA9IGNyZWF0ZVN0YXRpY0luc3RhbmNlQ2xhc3Nlcyh7XG4gIFN1cGVyY2xhc3M6IEFwcGxpY2F0aW9uLFxuICBpbXBsZW1lbnRhdGlvblR5cGU6ICdNaWRkbGV3YXJlJyxcbiAgY2FjaGVOYW1lOiB0cnVlLFxufSlcblxubGV0IENvbmRpdGlvbkNvbnRyb2xsZXIgPSBjcmVhdGVTdGF0aWNJbnN0YW5jZUNsYXNzZXMoe1xuICBTdXBlcmNsYXNzOiBBcHBsaWNhdGlvbixcbiAgaW1wbGVtZW50YXRpb25UeXBlOiAnQ29uZGl0aW9uJyxcbiAgY2FjaGVOYW1lOiB0cnVlLFxufSlcblxuZXhwb3J0IGRlZmF1bHQgKHt9ID0ge30pID0+IGFzeW5jICgpID0+IHtcbiAgbGV0IENsYXNzID0gQXBpQ2xhc3NcbiAgbGV0IG1pZGRsZXdhcmVBcnJheSA9IFtcbiAgICBjcmVhdGVDbGFzc0luc3RhbmNlUGVyUmVxdWVzdChDbGFzcyksXG4gICAgYXN5bmMgKGNvbnRleHQsIG5leHQpID0+IHtcbiAgICAgIGNvbnRleHQuc2V0KCdjb25uZWN0aW9uJywgJ2tlZXAtYWxpdmUnKVxuICAgICAgY29udGV4dC5zZXQoJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbicsICcqJylcbiAgICAgIGF3YWl0IGNvbnRleHQucmVxLnNldFRpbWVvdXQoMzAwMDApXG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9LFxuICAgIGFzeW5jIChjb250ZXh0LCBuZXh0KSA9PiB7XG4gICAgICAvLyBNSURETEVXQVJFIGUuZy4gYm9keSBwYXJzZXJcbiAgICAgIGxldCBtaWRkbGV3YXJlQXJyYXlcbiAgICAgIGxldCBtaWRkbGV3YXJlQ29udHJvbGxlciA9IGF3YWl0IE1pZGRsZXdhcmVDb250cm9sbGVyLmNyZWF0ZUNvbnRleHQoeyBwb3J0QXBwSW5zdGFuY2U6IGNvbnRleHQuaW5zdGFuY2UgfSlcbiAgICAgIG1pZGRsZXdhcmVBcnJheSA9IGF3YWl0IG1pZGRsZXdhcmVDb250cm9sbGVyLmluaXRpYWxpemVOZXN0ZWRVbml0KHsgbmVzdGVkVW5pdEtleTogJzg0c2ZhZC1mNzgzLTQxMGUtYTVjOS1hMjE2NzlhNDViZWInIH0pXG4gICAgICBhd2FpdCBpbXBsZW1lbnRNaWRkbGV3YXJlT25Nb2R1bGVVc2luZ0pzb24obWlkZGxld2FyZUFycmF5KShjb250ZXh0LCBuZXh0KVxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIG5leHQpID0+IHtcbiAgICAgIGxldCBjb25kaXRpb25Db250cm9sbGVyID0gYXdhaXQgQ29uZGl0aW9uQ29udHJvbGxlci5jcmVhdGVDb250ZXh0KHsgcG9ydEFwcEluc3RhbmNlOiBjb250ZXh0Lmluc3RhbmNlIH0pXG4gICAgICBsZXQgY2FsbGJhY2sgPSBhd2FpdCBjb25kaXRpb25Db250cm9sbGVyLmluaXRpYWxpemVOZXN0ZWRVbml0KHsgbmVzdGVkVW5pdEtleTogJ2FzZGY4LWQ5ZmItNDg5MC1hNmU5LTUxMDUyYThjMDExZicgfSlcbiAgICAgIGxldCBpc0NhbGxlZE5leHQgPSBhd2FpdCBpbXBsZW1lbnRDb25kaXRpb25BY3Rpb25Pbk1vZHVsZVVzaW5nSnNvbih7IHNldHRpbmc6IGNhbGxiYWNrIH0pKGNvbnRleHQsIG5leHQpXG4gICAgICBpZiAoIWlzQ2FsbGVkTmV4dCkgYXdhaXQgbmV4dCgpXG4gICAgfSxcbiAgICBhc3luYyAoY29udGV4dCwgbmV4dCkgPT4ge1xuICAgICAgLy8gY29uc29sZS5sb2coJ1JlYWNoZWQgbGFzdCBtaWRkbGV3YXJlJylcbiAgICB9LFxuICBdXG4gIENsYXNzLmFwcGx5S29hTWlkZGxld2FyZShtaWRkbGV3YXJlQXJyYXkpXG4gIGF3YWl0IENsYXNzLmNyZWF0ZUh0dHBTZXJ2ZXIoKVxufVxuIl19