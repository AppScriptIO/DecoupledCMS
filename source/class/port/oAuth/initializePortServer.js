"use strict";var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");Object.defineProperty(exports, "__esModule", { value: true });exports.default = void 0;var _koaViews = _interopRequireDefault(require("koa-views"));
var _koaBodyparser = _interopRequireDefault(require("koa-bodyparser"));
var _ApplicationClass = _interopRequireDefault(require("../../Application.class.js"));
var _OAuthClass = _interopRequireDefault(require("./OAuth.class.js"));
var _implementMiddlewareOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementMiddlewareOnModuleUsingJson.js"));
var _implementConditionActionOnModuleUsingJson = _interopRequireDefault(require("../../../utilityFunction/middleware/implementConditionActionOnModuleUsingJson.js"));
var _reusableNestedUnit = _interopRequireDefault(require("../../../module/reusableNestedUnit"));
var _createClassInstancePerRequestMiddleware = _interopRequireDefault(require("../../../utilityFunction/middleware/createClassInstancePerRequest.middleware.js"));

let MiddlewareController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Middleware',
  cacheName: true });

let ConditionController = (0, _reusableNestedUnit.default)({
  Superclass: _ApplicationClass.default,
  implementationType: 'Condition',
  cacheName: true });var _default =


({} = {}) => async () => {
  let Class = _OAuthClass.default;

  Class.serverKoa.use((0, _koaViews.default)('/', { map: { html: 'underscore', js: 'underscore' } }));
  let middlewareArray = [
  (0, _createClassInstancePerRequestMiddleware.default)(Class),
  (0, _koaBodyparser.default)(),
  async (context, next) => {


    await context.set('Access-Control-Allow-Origin', '*');
    await context.set('connection', 'keep-alive');
    await next();
  },
  async (context, next) => {


    let middlewareController = await MiddlewareController.createContext({ portAppInstance: context.instance });
    let middlewareArray = await middlewareController.initializeNestedUnit({ nestedUnitKey: 'd908335b-b60a-4a00-8c33-b9bc4a9c64ec' });
    await (0, _implementMiddlewareOnModuleUsingJson.default)(middlewareArray)(context, next);



  },
  async (context, next) => {

    let self = Class;


    let conditionController = await ConditionController.createContext({ portAppInstance: context.instance });

    let entrypointConditionTree = '0681f25c-4c00-4295-b12a-6ab81a3cb440';
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🍊 Entrypoint Condition Key: ${entrypointConditionTree} \n \n`);
    let callback = await conditionController.initializeNestedUnit({ nestedUnitKey: entrypointConditionTree });
    if (process.env.SZN_DEBUG == 'true' && context.header.debug == 'true') console.log(`🔀✔️ Choosen callback is: %c ${callback.name}`, self.config.style.green);

    await (0, _implementConditionActionOnModuleUsingJson.default)({ setting: callback })(context, next);

    if (callback && callback.name == 'post') {

      let x = await Class.authenticate(context.request, context.response);
      if (x) await next();
    }
  },
  async (context, next) => {
    context.status = 404;

    await next();
  }];

  Class.applyKoaMiddleware(middlewareArray);
  Class.createHttpServer();
};exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NvdXJjZS9jbGFzcy9wb3J0L29BdXRoL2luaXRpYWxpemVQb3J0U2VydmVyLmpzIl0sIm5hbWVzIjpbIk1pZGRsZXdhcmVDb250cm9sbGVyIiwiU3VwZXJjbGFzcyIsIkFwcGxpY2F0aW9uIiwiaW1wbGVtZW50YXRpb25UeXBlIiwiY2FjaGVOYW1lIiwiQ29uZGl0aW9uQ29udHJvbGxlciIsIkNsYXNzIiwiT0F1dGhDbGFzcyIsInNlcnZlcktvYSIsInVzZSIsIm1hcCIsImh0bWwiLCJqcyIsIm1pZGRsZXdhcmVBcnJheSIsImNvbnRleHQiLCJuZXh0Iiwic2V0IiwibWlkZGxld2FyZUNvbnRyb2xsZXIiLCJjcmVhdGVDb250ZXh0IiwicG9ydEFwcEluc3RhbmNlIiwiaW5zdGFuY2UiLCJpbml0aWFsaXplTmVzdGVkVW5pdCIsIm5lc3RlZFVuaXRLZXkiLCJzZWxmIiwiY29uZGl0aW9uQ29udHJvbGxlciIsImVudHJ5cG9pbnRDb25kaXRpb25UcmVlIiwicHJvY2VzcyIsImVudiIsIlNaTl9ERUJVRyIsImhlYWRlciIsImRlYnVnIiwiY29uc29sZSIsImxvZyIsImNhbGxiYWNrIiwibmFtZSIsImNvbmZpZyIsInN0eWxlIiwiZ3JlZW4iLCJzZXR0aW5nIiwieCIsImF1dGhlbnRpY2F0ZSIsInJlcXVlc3QiLCJyZXNwb25zZSIsInN0YXR1cyIsImFwcGx5S29hTWlkZGxld2FyZSIsImNyZWF0ZUh0dHBTZXJ2ZXIiXSwibWFwcGluZ3MiOiJ5TEFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLElBQUlBLG9CQUFvQixHQUFHLGlDQUE0QjtBQUNyREMsRUFBQUEsVUFBVSxFQUFFQyx5QkFEeUM7QUFFckRDLEVBQUFBLGtCQUFrQixFQUFFLFlBRmlDO0FBR3JEQyxFQUFBQSxTQUFTLEVBQUUsSUFIMEMsRUFBNUIsQ0FBM0I7O0FBS0EsSUFBSUMsbUJBQW1CLEdBQUcsaUNBQTRCO0FBQ3BESixFQUFBQSxV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QjtBQUN2QkQsSUFBQUEsT0FBTyxDQUFDNkIsTUFBUixHQUFpQixHQUFqQjs7QUFFQSxVQUFNNUIsSUFBSSxFQUFWO0FBQ0QsR0E1Q21CLENBQXRCOztBQThDQVQsRUFBQUEsS0FBSyxDQUFDc0Msa0JBQU4sQ0FBeUIvQixlQUF6QjtBQUNBUCxFQUFBQSxLQUFLLENBQUN1QyxnQkFBTjtBQUNELEMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgdmlld3MgZnJvbSAna29hLXZpZXdzJ1xuaW1wb3J0IGJvZHlQYXJzZXIgZnJvbSAna29hLWJvZHlwYXJzZXInXG5pbXBvcnQgeyBkZWZhdWx0IGFzIEFwcGxpY2F0aW9uIH0gZnJvbSAnLi4vLi4vQXBwbGljYXRpb24uY2xhc3MuanMnXG5pbXBvcnQgT0F1dGhDbGFzcyBmcm9tICcuL09BdXRoLmNsYXNzLmpzJ1xuaW1wb3J0IGltcGxlbWVudE1pZGRsZXdhcmVPbk1vZHVsZVVzaW5nSnNvbiBmcm9tICcuLi8uLi8uLi91dGlsaXR5RnVuY3Rpb24vbWlkZGxld2FyZS9pbXBsZW1lbnRNaWRkbGV3YXJlT25Nb2R1bGVVc2luZ0pzb24uanMnIC8vIE1pZGRsZXdhcmUgZXh0ZW5kaW5nIHNlcnZlciBmdW5jdGlvbmFsaXR5XG5pbXBvcnQgaW1wbGVtZW50Q29uZGl0aW9uQWN0aW9uT25Nb2R1bGVVc2luZ0pzb24gZnJvbSAnLi4vLi4vLi4vdXRpbGl0eUZ1bmN0aW9uL21pZGRsZXdhcmUvaW1wbGVtZW50Q29uZGl0aW9uQWN0aW9uT25Nb2R1bGVVc2luZ0pzb24uanMnXG5pbXBvcnQgY3JlYXRlU3RhdGljSW5zdGFuY2VDbGFzc2VzIGZyb20gJy4uLy4uLy4uL21vZHVsZS9yZXVzYWJsZU5lc3RlZFVuaXQnXG5pbXBvcnQgY3JlYXRlQ2xhc3NJbnN0YW5jZVBlclJlcXVlc3QgZnJvbSAnLi4vLi4vLi4vdXRpbGl0eUZ1bmN0aW9uL21pZGRsZXdhcmUvY3JlYXRlQ2xhc3NJbnN0YW5jZVBlclJlcXVlc3QubWlkZGxld2FyZS5qcydcblxubGV0IE1pZGRsZXdhcmVDb250cm9sbGVyID0gY3JlYXRlU3RhdGljSW5zdGFuY2VDbGFzc2VzKHtcbiAgU3VwZXJjbGFzczogQXBwbGljYXRpb24sXG4gIGltcGxlbWVudGF0aW9uVHlwZTogJ01pZGRsZXdhcmUnLFxuICBjYWNoZU5hbWU6IHRydWUsXG59KVxubGV0IENvbmRpdGlvbkNvbnRyb2xsZXIgPSBjcmVhdGVTdGF0aWNJbnN0YW5jZUNsYXNzZXMoe1xuICBTdXBlcmNsYXNzOiBBcHBsaWNhdGlvbixcbiAgaW1wbGVtZW50YXRpb25UeXBlOiAnQ29uZGl0aW9uJyxcbiAgY2FjaGVOYW1lOiB0cnVlLFxufSlcblxuZXhwb3J0IGRlZmF1bHQgKHt9ID0ge30pID0+IGFzeW5jICgpID0+IHtcbiAgbGV0IENsYXNzID0gT0F1dGhDbGFzc1xuICAvLyBUZW1wbGF0aW5nIGVuZ2luZSAmIGFzc29jaWF0ZWQgZXh0ZW50aW9uLlxuICBDbGFzcy5zZXJ2ZXJLb2EudXNlKHZpZXdzKCcvJywgeyBtYXA6IHsgaHRtbDogJ3VuZGVyc2NvcmUnLCBqczogJ3VuZGVyc2NvcmUnIH0gfSkpXG4gIGxldCBtaWRkbGV3YXJlQXJyYXkgPSBbXG4gICAgY3JlYXRlQ2xhc3NJbnN0YW5jZVBlclJlcXVlc3QoQ2xhc3MpLFxuICAgIGJvZHlQYXJzZXIoKSxcbiAgICBhc3luYyAoY29udGV4dCwgbmV4dCkgPT4ge1xuICAgICAgLy8gaW5zdGFuY2UubWlkZGxld2FyZUFycmF5LnB1c2gobWlkZGxld2FyZSlcbiAgICAgIC8vIGF3YWl0IGNvbnRleHQucmVxLnNldFRpbWVvdXQoMCk7IC8vIGNoYW5nZXMgZGVmYXVsdCBOb2RlanMgdGltZW91dCAoZGVmYXVsdCAxMjAgc2Vjb25kcykuXG4gICAgICBhd2FpdCBjb250ZXh0LnNldCgnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJywgJyonKVxuICAgICAgYXdhaXQgY29udGV4dC5zZXQoJ2Nvbm5lY3Rpb24nLCAna2VlcC1hbGl2ZScpXG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9LFxuICAgIGFzeW5jIChjb250ZXh0LCBuZXh0KSA9PiB7XG4gICAgICAvLyBsZXQgd2FpdCA9IG1zID0+IG5ldyBQcm9taXNlKHJlc29sdmUgPT4gc2V0VGltZW91dChyZXNvbHZlLCBtcykpO1xuICAgICAgLy8gYXdhaXQgd2FpdCg1MDApXG4gICAgICBsZXQgbWlkZGxld2FyZUNvbnRyb2xsZXIgPSBhd2FpdCBNaWRkbGV3YXJlQ29udHJvbGxlci5jcmVhdGVDb250ZXh0KHsgcG9ydEFwcEluc3RhbmNlOiBjb250ZXh0Lmluc3RhbmNlIH0pXG4gICAgICBsZXQgbWlkZGxld2FyZUFycmF5ID0gYXdhaXQgbWlkZGxld2FyZUNvbnRyb2xsZXIuaW5pdGlhbGl6ZU5lc3RlZFVuaXQoeyBuZXN0ZWRVbml0S2V5OiAnZDkwODMzNWItYjYwYS00YTAwLThjMzMtYjliYzRhOWM2NGVjJyB9KVxuICAgICAgYXdhaXQgaW1wbGVtZW50TWlkZGxld2FyZU9uTW9kdWxlVXNpbmdKc29uKG1pZGRsZXdhcmVBcnJheSkoY29udGV4dCwgbmV4dClcblxuICAgICAgLy8gY29udGV4dC5pbnN0YW5jZS5jb25maWcuY2xpZW50QmFzZVBhdGggPSBhd2FpdCBBcHBsaWNhdGlvbi5jb25maWcuY2xpZW50QmFzZVBhdGhcbiAgICAgIC8vIGF3YWl0IG5leHQoKVxuICAgIH0sXG4gICAgYXN5bmMgKGNvbnRleHQsIG5leHQpID0+IHtcbiAgICAgIC8vIENPTkRJVElPTlxuICAgICAgbGV0IHNlbGYgPSBDbGFzc1xuICAgICAgLy8gWzFdIENyZWF0ZSBpbnN0YW5jZXMgYW5kIGNoZWNrIGNvbmRpdGlvbnMuIEdldCBjYWxsYmFjayBlaXRoZXIgYSBmdW5jdGlvbiBvciBkb2N1bWVudFxuICAgICAgLy8gVGhlIGluc3RhbmNlIHJlc3BvbnNpYmxlIGZvciBycXVlc3RzIG9mIHNwZWNpZmljIHBvcnQuXG4gICAgICBsZXQgY29uZGl0aW9uQ29udHJvbGxlciA9IGF3YWl0IENvbmRpdGlvbkNvbnRyb2xsZXIuY3JlYXRlQ29udGV4dCh7IHBvcnRBcHBJbnN0YW5jZTogY29udGV4dC5pbnN0YW5jZSB9KVxuXG4gICAgICBsZXQgZW50cnlwb2ludENvbmRpdGlvblRyZWUgPSAnMDY4MWYyNWMtNGMwMC00Mjk1LWIxMmEtNmFiODFhM2NiNDQwJ1xuICAgICAgaWYgKHByb2Nlc3MuZW52LlNaTl9ERUJVRyA9PSAndHJ1ZScgJiYgY29udGV4dC5oZWFkZXIuZGVidWcgPT0gJ3RydWUnKSBjb25zb2xlLmxvZyhg8J+NiiBFbnRyeXBvaW50IENvbmRpdGlvbiBLZXk6ICR7ZW50cnlwb2ludENvbmRpdGlvblRyZWV9IFxcbiBcXG5gKVxuICAgICAgbGV0IGNhbGxiYWNrID0gYXdhaXQgY29uZGl0aW9uQ29udHJvbGxlci5pbml0aWFsaXplTmVzdGVkVW5pdCh7IG5lc3RlZFVuaXRLZXk6IGVudHJ5cG9pbnRDb25kaXRpb25UcmVlIH0pXG4gICAgICBpZiAocHJvY2Vzcy5lbnYuU1pOX0RFQlVHID09ICd0cnVlJyAmJiBjb250ZXh0LmhlYWRlci5kZWJ1ZyA9PSAndHJ1ZScpIGNvbnNvbGUubG9nKGDwn5SA4pyU77iPIENob29zZW4gY2FsbGJhY2sgaXM6ICVjICR7Y2FsbGJhY2submFtZX1gLCBzZWxmLmNvbmZpZy5zdHlsZS5ncmVlbilcbiAgICAgIC8vIFsyXSBVc2UgY2FsbGJhY2tcbiAgICAgIGF3YWl0IGltcGxlbWVudENvbmRpdGlvbkFjdGlvbk9uTW9kdWxlVXNpbmdKc29uKHsgc2V0dGluZzogY2FsbGJhY2sgfSkoY29udGV4dCwgbmV4dClcblxuICAgICAgaWYgKGNhbGxiYWNrICYmIGNhbGxiYWNrLm5hbWUgPT0gJ3Bvc3QnKSB7XG4gICAgICAgIC8vIGZvciB0ZXN0aW5nIHB1cnBvc2VzLlxuICAgICAgICBsZXQgeCA9IGF3YWl0IENsYXNzLmF1dGhlbnRpY2F0ZShjb250ZXh0LnJlcXVlc3QsIGNvbnRleHQucmVzcG9uc2UpXG4gICAgICAgIGlmICh4KSBhd2FpdCBuZXh0KClcbiAgICAgIH1cbiAgICB9LFxuICAgIGFzeW5jIChjb250ZXh0LCBuZXh0KSA9PiB7XG4gICAgICBjb250ZXh0LnN0YXR1cyA9IDQwNFxuICAgICAgLy8gY29uc29sZS5sb2coJ0xhc3QgTWlkZGxld2FyZSByZWFjaGVkLicpXG4gICAgICBhd2FpdCBuZXh0KClcbiAgICB9LFxuICBdXG4gIENsYXNzLmFwcGx5S29hTWlkZGxld2FyZShtaWRkbGV3YXJlQXJyYXkpXG4gIENsYXNzLmNyZWF0ZUh0dHBTZXJ2ZXIoKVxufVxuIl19